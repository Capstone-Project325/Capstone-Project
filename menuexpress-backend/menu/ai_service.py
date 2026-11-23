import json
import re

import requests
from django.conf import settings

from .models import MenuItem


MAX_PREFERENCE_LENGTH = 500
REQUEST_TIMEOUT_SECONDS = 15
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
FALLBACK_RECOMMENDATION = "Based on your stated preferences, this available menu item may be a match."


def _fallback(items, preference):
	if not items:
		return {
			"item_names": [],
			"recommendation": "There are no currently available menu items to recommend.",
			"fallback": True,
		}

	ignored_words = {"and", "for", "have", "like", "with", "want", "something", "please"}
	preference_words = {
		word for word in re.findall(r"[a-z0-9]+", preference.lower()) if word not in ignored_words
	}

	def score(item):
		searchable_text = " ".join(
			[item.name, item.description, item.category]
			+ (item.ingredients if isinstance(item.ingredients, list) else [])
		).lower()
		return sum(word in searchable_text for word in preference_words)

	selected_item = sorted(items, key=lambda item: (-score(item), item.name))[0]
	return {
		"item_names": [selected_item.name],
		"recommendation": FALLBACK_RECOMMENDATION,
		"fallback": True,
	}


def _menu_data(items):
	return [
		{
			"name": item.name,
			"description": item.description,
			"category": item.category,
			"price": str(item.price),
			"ingredients": item.ingredients,
			"allergens": item.allergens,
		}
		for item in items
	]


def _validated_recommendation(response_text, available_names):
	result = json.loads(response_text)
	if not isinstance(result, dict) or set(result) != {"item_names", "recommendation"}:
		raise ValueError("Invalid recommendation structure")

	item_names = result["item_names"]
	recommendation = result["recommendation"]
	if (
		not isinstance(item_names, list)
		or not item_names
		or any(not isinstance(name, str) or not name for name in item_names)
		or len(set(item_names)) != len(item_names)
		or not isinstance(recommendation, str)
		or not recommendation.strip()
	):
		raise ValueError("Invalid recommendation values")

	if any(name not in available_names for name in item_names):
		raise ValueError("Recommendation contains an unavailable item")

	allergy_safety_claim = re.compile(
		r"\b(allergy[- ]safe|allergen[- ]free|safe for (people with )?allergies)\b",
		re.IGNORECASE,
	)
	if allergy_safety_claim.search(recommendation):
		raise ValueError("Recommendation makes an allergy-safety claim")

	return {"item_names": item_names, "recommendation": recommendation.strip(), "fallback": False}


def get_meal_recommendation(preference):
	if not isinstance(preference, str) or not preference.strip():
		raise ValueError("Preference must be a non-empty string")
	if len(preference) > MAX_PREFERENCE_LENGTH:
		raise ValueError("Preference must be 500 characters or fewer")

	items = list(MenuItem.objects.filter(is_available=True))
	if not items:
		return _fallback(items, preference)

	api_key = getattr(settings, "GEMINI_API_KEY", "")
	if not api_key:
		return _fallback(items, preference)

	try:
		prompt_path = settings.BASE_DIR / "prompts" / "meal_recommendation_v1.txt"
		prompt_template = prompt_path.read_text(encoding="utf-8")
		if "{preference}" not in prompt_template or "{menu_data}" not in prompt_template:
			raise ValueError("Prompt placeholders are missing")

		prompt = prompt_template.replace("{preference}", json.dumps(preference, ensure_ascii=False))
		prompt = prompt.replace("{menu_data}", json.dumps(_menu_data(items), ensure_ascii=False))
		model = getattr(settings, "GEMINI_MODEL", "gemini-3.8-flash")
		payload = {
			"contents": [{"role": "user", "parts": [{"text": prompt}]}],
			"generationConfig": {
				"responseMimeType": "application/json",
				"responseSchema": {
					"type": "OBJECT",
					"properties": {
						"item_names": {"type": "ARRAY", "items": {"type": "STRING"}},
						"recommendation": {"type": "STRING"},
					},
					"required": ["item_names", "recommendation"],
				},
				"temperature": 0,
			},
		}
		response = requests.post(
			GEMINI_API_URL.format(model=model),
			headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
			json=payload,
			timeout=REQUEST_TIMEOUT_SECONDS,
		)
		response.raise_for_status()

		response_data = response.json()
		candidates = response_data["candidates"]
		parts = candidates[0]["content"]["parts"]
		response_text = "".join(part["text"] for part in parts if isinstance(part.get("text"), str))
		if not response_text:
			raise ValueError("Gemini returned no text")
		return _validated_recommendation(response_text, {item.name for item in items})
	except (requests.RequestException, OSError, ValueError, TypeError, KeyError, IndexError, AttributeError):
		return _fallback(items, preference)
