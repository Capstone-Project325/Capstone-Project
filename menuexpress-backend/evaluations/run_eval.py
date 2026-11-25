import json
import re
import sys
import time
from pathlib import Path
from datetime import datetime, timezone
from decimal import Decimal

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from chatbot.ai_service import generate_ai_reply, MODEL_NAME

GOLDEN_FILE = BASE_DIR / "evaluations" / "golden_set.json"
RESULTS_FILE = BASE_DIR / "evaluations" / "results.json"

HALLUCINATION_THRESHOLD = 0.90
CONSISTENCY_THRESHOLD = 0.90
RUNS_PER_QUESTION = 2
REQUEST_DELAY = 5


def normalize(text):
    return (
        text.lower()
        .replace("’", "'")
        .replace("–", "-")
        .replace("—", "-")
        .replace("**", "")
        .replace(",", "")
    )



def extract_prices(text):
    # Remove budget references before checking menu prices.
    text = re.sub(
        r"\b(?:under|below|less than|up to|at most)"
        r"\s+\$\s*\d+(?:\.\d{1,2})?",
        "",
        text,
        flags=re.IGNORECASE
    )

    matches = re.findall(
        r"\$\s*(\d+\.\d{2})",
        text
    )

    return {Decimal(value) for value in matches}



def extract_points(text):
    matches = re.findall(
        r"\b(\d+)\s*(?:reward\s+)?(?:points|pts)\b",
        normalize(text)
    )
    return {int(value) for value in matches}


def check_response(case, reply):
    text = normalize(reply)
    errors = []

    for required in case.get("required", []):
        pattern = r"(?<!\w)" + re.escape(
            normalize(required)
        ) + r"(?!\w)"

        if not re.search(pattern, text):
            errors.append(
                f"Missing required fact: {required}"
            )

    alternatives = case.get("required_any", [])

    if alternatives and not any(
        normalize(value) in text
        for value in alternatives
    ):
        errors.append("Missing required alternative")

    for forbidden in case.get("forbidden", []):
        if normalize(forbidden) in text:
            errors.append(
                f"Forbidden content: {forbidden}"
            )

    if "allowed_prices" in case:
        actual_prices = extract_prices(text)

        allowed_prices = {
            Decimal(value)
            for value in case["allowed_prices"]
        }

        unexpected = actual_prices - allowed_prices

        if unexpected:
            errors.append(
                f"Unexpected prices: {unexpected}"
            )

        missing = allowed_prices - actual_prices

        if missing:
            errors.append(
                f"Missing prices: {missing}"
            )

    if "allowed_points" in case:
        actual_points = extract_points(text)
        allowed_points = set(case["allowed_points"])

        if actual_points != allowed_points:
            errors.append("Incorrect reward points")

    return len(errors) == 0, errors


def factual_signature(case, reply):
    text = normalize(reply)

    required_facts = tuple(
        normalize(value) in text
        for value in case.get("required", [])
    )

    alternative_present = any(
        normalize(value) in text
        for value in case.get("required_any", [])
    )

    forbidden_facts = tuple(
        normalize(value) in text
        for value in case.get("forbidden", [])
    )

    prices = tuple(sorted(extract_prices(text)))
    points = tuple(sorted(extract_points(text)))

    return (
        required_facts,
        alternative_present,
        forbidden_facts,
        prices,
        points
    )


def main():
    cases = json.loads(
        GOLDEN_FILE.read_text(encoding="utf-8")
    )

    if len(cases) < 15:
        print("FAIL: At least 15 golden cases required.")
        return 1

    total_responses = 0
    correct_responses = 0
    consistent_cases = 0
    critical_failures = 0
    api_errors = 0
    results = []

    print("=" * 55)
    print("MR. BIG AI - EVALUATION SUITE")
    print(f"Model: {MODEL_NAME}")
    print(f"Golden questions: {len(cases)}")
    print(f"Runs per question: {RUNS_PER_QUESTION}")
    print("=" * 55)

    for case in cases:
        responses = []
        signatures = []
        case_passed = True

        print(f"\nQuestion {case['id']}: {case['input']}")

        for run in range(RUNS_PER_QUESTION):
            total_responses += 1

            try:
                reply = generate_ai_reply(case["input"])

                passed, errors = check_response(
                    case, reply
                )

                signatures.append(
                    factual_signature(case, reply)
                )

                if passed:
                    correct_responses += 1
                else:
                    case_passed = False

                responses.append({
                    "run": run + 1,
                    "reply": reply,
                    "passed": passed,
                    "errors": errors
                })

                print(
                    f"  Run {run + 1}: "
                    f"{'PASS' if passed else 'FAIL'}"
                )

                for error in errors:
                    print(f"    {error}")

            except Exception as error:
                api_errors += 1
                case_passed = False

                responses.append({
                    "run": run + 1,
                    "passed": False,
                    "errors": [type(error).__name__]
                })

                print(
                    f"  Run {run + 1}: API ERROR "
                    f"({type(error).__name__})"
                )

            time.sleep(REQUEST_DELAY)

        consistent = (
            case_passed
            and len(signatures) == RUNS_PER_QUESTION
            and all(
                signature == signatures[0]
                for signature in signatures
            )
        )

        if consistent:
            consistent_cases += 1

        if case.get("critical") and not case_passed:
            critical_failures += 1

        print(
            "  Consistency: "
            + ("PASS" if consistent else "FAIL")
        )

        results.append({
            "id": case["id"],
            "category": case["category"],
            "input": case["input"],
            "expected": case["expected"],
            "consistent": consistent,
            "responses": responses
        })

    hallucination_score = (
        correct_responses / total_responses
    )

    consistency_score = (
        consistent_cases / len(cases)
    )

    passed = (
        hallucination_score >= HALLUCINATION_THRESHOLD
        and consistency_score >= CONSISTENCY_THRESHOLD
        and critical_failures == 0
        and api_errors == 0
    )

    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "model": MODEL_NAME,
        "golden_questions": len(cases),
        "total_responses": total_responses,
        "correct_responses": correct_responses,
        "consistent_cases": consistent_cases,
        "hallucination_score": hallucination_score,
        "consistency_score": consistency_score,
        "hallucination_threshold": HALLUCINATION_THRESHOLD,
        "consistency_threshold": CONSISTENCY_THRESHOLD,
        "critical_failures": critical_failures,
        "api_errors": api_errors,
        "passed": passed,
        "results": results
    }

    RESULTS_FILE.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8"
    )

    print("\n" + "=" * 55)
    print("FINAL EVALUATION RESULTS")
    print("=" * 55)

    print(
        f"Hallucination accuracy: "
        f"{hallucination_score:.1%}"
    )

    print(
        f"Consistency score: "
        f"{consistency_score:.1%}"
    )

    print(f"Critical failures: {critical_failures}")
    print(f"API errors: {api_errors}")

    print(
        f"Overall result: "
        f"{'PASS' if passed else 'FAIL'}"
    )

    print("Results saved to evaluations/results.json")

    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())