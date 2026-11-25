import re

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ai_service import generate_ai_reply


def generate_reply(message):
    text = message.lower().strip()

    # Food allergy safety
    if any(word in text for word in [
        "allergy", "allergic", "allergies",
        "allergen", "intolerance", "celiac",
        "gluten", "peanut", "dairy-free",
        "nut-free", "cross-contamination"
    ]):
        return (
            "Please confirm ingredients and "
            "cross-contamination risks with our "
            "restaurant staff before ordering. "
            "We cannot guarantee that any item "
            "is allergen-free."
        )

    # Avoid unsupported dietary guarantees
    if any(word in text for word in [
        "vegan", "halal", "kosher"
    ]):
        return (
            "I cannot confirm those dietary "
            "requirements right now. Please check "
            "with our restaurant staff."
        )

    # Avoid incorrect budget recommendations
    if "$" in text or re.search(
        r"\b(budget|under|below|less than|"
        r"afford|cheapest|dollars|at most)\b",
        text
    ):
        return (
            "Our AI assistant is temporarily "
            "unavailable. Please visit the Order "
            "tab to compare menu prices and find "
            "something within your budget."
        )

    # Vegetarian options before burger recommendations
    if "vegetarian" in text or "veggie" in text:
        return (
            "Our vegetarian menu includes "
            "Veggie Single ($9.85), "
            "Veggie Double ($10.29), "
            "Mushroom Swiss ($11.99), and "
            "Eggplant Parm ($11.49)."
        )

    # Rewards information
    if "reward" in text or "points" in text:
        return (
            "Visit the Rewards tab to check "
            "your points and available rewards."
        )

    # Chicken menu
    if any(word in text for word in [
        "chicken", "tenders", "nuggets"
    ]):
        return (
            "Our Cluckin' Classic costs $7.95. "
            "Tenders start at $4.74 and nuggets "
            "start at $3.49. Visit the Order tab "
            "for all portion prices."
        )

    # Fries
    if "fries" in text:
        return (
            "Our fries come in three sizes: "
            "Small $2.59, Medium $3.99, "
            "Large $4.79."
        )

    # Drinks
    if any(word in text for word in [
        "drink", "coffee", "tea",
        "soda", "hot chocolate"
    ]):
        return (
            "We offer iced coffee, hot coffee, "
            "tea, hot chocolate, and soda. "
            "Visit the Order tab for size prices."
        )

    # Burger recommendations
    if "double" in text and "burger" in text:
        return "Try our Double Mr. Big for $9.15!"

    if "burger" in text or "recommend" in text:
        return (
            "I recommend our signature Mr. Big "
            "burger for $8.35!"
        )

    # Ordering instructions
    if "order" in text or "payment" in text:
        return (
            "Visit the Order tab to customize "
            "your food and add items to your cart. "
            "I cannot place orders or process payments."
        )

    if "thank" in text:
        return "You're welcome! Stay hungry, stay BIG!"

    if text in ["hi", "hello", "hey"]:
        return (
            "Welcome to Mr. Big! Our AI assistant "
            "is temporarily unavailable, but you "
            "can still explore our menu."
        )

    # Safe default fallback
    return (
        "Our AI assistant is temporarily unavailable. "
        "Please visit the Order or Rewards tab "
        "for accurate menu and reward information."
    )


@api_view(["POST"])
def chat(request):
    message = request.data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return Response(
            {"error": "Please enter a message."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(message) > 1000:
        return Response(
            {"error": "Message is too long."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        reply = generate_ai_reply(message)
        source = "gemini_ai"

    except Exception:
        reply = generate_reply(message)
        source = "python_fallback"

    return Response({
        "reply": reply,
        "source": source
    })