import json
import os
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django


django.setup()

from django.conf import settings
from menu.ai_service import get_meal_recommendation
from menu.models import MenuItem


GOLDEN_DATASET = Path(__file__).with_name("meal_recommendation_golden.json")
HALLUCINATION_PASS_THRESHOLD = 1.0
CONSISTENCY_PASS_THRESHOLD = 0.80
REPEATED_CONSISTENCY_PASS_THRESHOLD = 0.80


def item_matches_criteria(item, example):
    expected_categories = {category.casefold() for category in example["expected_categories"]}
    if item.category.casefold() not in expected_categories:
        return False

    expected_terms = [term.casefold() for term in example["expected_any_terms"]]
    searchable_text = " ".join(
        [item.name, item.description, item.category]
        + (item.ingredients if isinstance(item.ingredients, list) else [])
    ).casefold()
    return not expected_terms or any(term in searchable_text for term in expected_terms)


def main():
    api_key = getattr(settings, "GEMINI_API_KEY", "")
    if not api_key:
        raise SystemExit("Evaluation failed: GEMINI_API_KEY is not configured; real-model evaluation was not run.")

    examples = json.loads(GOLDEN_DATASET.read_text(encoding="utf-8"))
    if len(examples) < 15:
        raise SystemExit("Evaluation failed: golden dataset must contain at least 15 examples.")

    available_items = list(MenuItem.objects.filter(is_available=True))
    if not available_items:
        raise SystemExit("Evaluation failed: the database has no available menu items.")

    available_by_name = {item.name: item for item in available_items}
    consistency_passes = 0
    repeated_consistency_passes = 0
    hallucinated_names = 0
    recommendation_count = 0

    for example in examples:
        results = [
            get_meal_recommendation(example["preference"]),
            get_meal_recommendation(example["preference"]),
        ]
        if any(result["fallback"] for result in results):
            raise SystemExit(
                f"Evaluation failed for {example['id']}: a recommendation used fallback; check API availability and credentials."
            )

        first_names, second_names = (result["item_names"] for result in results)
        if not first_names or not second_names:
            raise SystemExit(f"Evaluation failed for {example['id']}: a run returned no items.")

        normalized_runs = [
            tuple(sorted(" ".join(name.split()).casefold() for name in names))
            for names in (first_names, second_names)
        ]
        if normalized_runs[0] == normalized_runs[1]:
            repeated_consistency_passes += 1

        for recommended_names in (first_names, second_names):
            recommendation_count += len(recommended_names)
            valid_items = []
            for name in recommended_names:
                item = available_by_name.get(name)
                if item is None:
                    hallucinated_names += 1
                else:
                    valid_items.append(item)

            if valid_items and any(item_matches_criteria(item, example) for item in valid_items):
                consistency_passes += 1

        print(f"{example['id']}: run 1={', '.join(first_names)} | run 2={', '.join(second_names)}")

    hallucination_pass_rate = (
        1 - hallucinated_names / recommendation_count if recommendation_count else 0
    )
    consistency_rate = consistency_passes / (len(examples) * 2)
    repeated_consistency_rate = repeated_consistency_passes / len(examples)
    passed = (
        hallucination_pass_rate >= HALLUCINATION_PASS_THRESHOLD
        and consistency_rate >= CONSISTENCY_PASS_THRESHOLD
        and repeated_consistency_rate >= REPEATED_CONSISTENCY_PASS_THRESHOLD
    )

    print(f"Model: {getattr(settings, 'GEMINI_MODEL', 'gemini-3.8-flash')}")
    print(f"Examples: {len(examples)}")
    print(f"Hallucination pass rate: {hallucination_pass_rate:.1%} (required: {HALLUCINATION_PASS_THRESHOLD:.0%})")
    print(f"Preference consistency: {consistency_rate:.1%} (required: {CONSISTENCY_PASS_THRESHOLD:.0%})")
    print(f"Repeated-run consistency: {repeated_consistency_rate:.1%} (required: {REPEATED_CONSISTENCY_PASS_THRESHOLD:.0%})")
    print(f"Result: {'PASS' if passed else 'FAIL'}")
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
