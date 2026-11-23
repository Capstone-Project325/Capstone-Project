import json
from types import SimpleNamespace
from unittest.mock import Mock, patch

import requests
from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory

from . import ai_service, views


class MealRecommendationServiceTests(SimpleTestCase):
	def setUp(self):
		self.items = [
			SimpleNamespace(
				name="Mr. Big",
				description="Beef burger with classic toppings.",
				category="Burgers",
				price="8.35",
				ingredients=["beef patty", "bun"],
				allergens=["wheat"],
				is_available=True,
			),
			SimpleNamespace(
				name="Fries: Small",
				description="Crisp fries.",
				category="Sides",
				price="2.59",
				ingredients=["potatoes", "salt"],
				allergens=[],
				is_available=True,
			),
		]

	def gemini_response(self, text):
		response = Mock()
		response.json.return_value = {
			"candidates": [{"content": {"parts": [{"text": text}]}}]
		}
		response.raise_for_status.return_value = None
		return response

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_successful_valid_ai_response(self, filter_items, post):
		filter_items.return_value = self.items
		post.return_value = self.gemini_response(
			json.dumps({"item_names": ["Mr. Big"], "recommendation": "A beef burger with classic toppings."})
		)

		result = ai_service.get_meal_recommendation("I want a beef burger")

		self.assertEqual(result["item_names"], ["Mr. Big"])
		self.assertFalse(result["fallback"])
		self.assertEqual(post.call_args.kwargs["headers"]["x-goog-api-key"], "test-key")
		filter_items.assert_called_once_with(is_available=True)

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "")
	def test_missing_api_key_uses_fallback(self, filter_items, post):
		filter_items.return_value = self.items

		result = ai_service.get_meal_recommendation("beef burger")

		self.assertEqual(result["item_names"], ["Mr. Big"])
		self.assertTrue(result["fallback"])
		self.assertNotIn("allergy-safe", result["recommendation"].lower())
		post.assert_not_called()

	@patch("menu.ai_service.requests.post", side_effect=requests.Timeout)
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_request_timeout_uses_fallback(self, filter_items, post):
		filter_items.return_value = self.items

		result = ai_service.get_meal_recommendation("fries")

		self.assertEqual(result["item_names"], ["Fries: Small"])
		self.assertTrue(result["fallback"])
		post.assert_called_once()

	@patch("menu.ai_service.requests.post", side_effect=requests.ConnectionError)
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_api_failure_uses_fallback(self, filter_items, post):
		filter_items.return_value = self.items

		result = ai_service.get_meal_recommendation("fries")

		self.assertTrue(result["fallback"])
		self.assertEqual(result["item_names"], ["Fries: Small"])
		post.assert_called_once()

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_malformed_json_uses_fallback(self, filter_items, post):
		filter_items.return_value = self.items
		post.return_value = self.gemini_response('{"item_names":')

		result = ai_service.get_meal_recommendation("beef burger")

		self.assertTrue(result["fallback"])

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_hallucinated_item_uses_fallback(self, filter_items, post):
		filter_items.return_value = self.items
		post.return_value = self.gemini_response(
			json.dumps({"item_names": ["Truffle Burger"], "recommendation": "A tasty burger."})
		)

		result = ai_service.get_meal_recommendation("beef burger")

		self.assertTrue(result["fallback"])
		self.assertNotIn("Truffle Burger", result["item_names"])

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	@patch("menu.ai_service.settings.GEMINI_API_KEY", "test-key")
	def test_empty_response_and_allergy_safety_claim_use_fallback(self, filter_items, post):
		filter_items.return_value = self.items
		post.return_value = self.gemini_response(
			json.dumps({"item_names": [], "recommendation": "No item."})
		)
		self.assertTrue(ai_service.get_meal_recommendation("beef burger")["fallback"])

		post.return_value = self.gemini_response(json.dumps({"item_names": ["Mr. Big"]}))
		self.assertTrue(ai_service.get_meal_recommendation("beef burger")["fallback"])

		post.return_value = self.gemini_response(
			json.dumps({"item_names": ["Mr. Big"], "recommendation": "This is allergy-safe."})
		)
		result = ai_service.get_meal_recommendation("beef burger")
		self.assertTrue(result["fallback"])

	@patch("menu.ai_service.requests.post")
	@patch("menu.ai_service.MenuItem.objects.filter")
	def test_empty_non_string_and_overlong_preferences_are_rejected(self, filter_items, post):
		for preference in ("", "   ", None, 42, "x" * 501):
			with self.subTest(preference=preference):
				with self.assertRaises(ValueError):
					ai_service.get_meal_recommendation(preference)
		filter_items.assert_not_called()
		post.assert_not_called()


class MealRecommendationEndpointTests(SimpleTestCase):
	@patch("menu.views.get_meal_recommendation")
	def test_valid_preference_returns_service_result(self, recommend):
		recommend.return_value = {
			"item_names": ["Mr. Big"],
			"recommendation": "A beef burger.",
			"fallback": False,
		}
		request = APIRequestFactory().post(
			"/api/menu/ai-recommendation/", {"preference": "beef burger"}, format="json"
		)

		response = views.ai_recommendation(request)

		self.assertEqual(response.status_code, 200)
		self.assertFalse(response.data["fallback"])
		recommend.assert_called_once_with("beef burger")

	@patch("menu.views.get_meal_recommendation")
	def test_invalid_preference_returns_bad_request(self, recommend):
		for preference in ("", "   ", 42, "x" * 501):
			with self.subTest(preference=preference):
				request = APIRequestFactory().post(
					"/api/menu/ai-recommendation/", {"preference": preference}, format="json"
				)
				response = views.ai_recommendation(request)
				self.assertEqual(response.status_code, 400)
		recommend.assert_not_called()
