
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def generate_reply(message):
    text = message.lower().strip()

    if "allergy" in text or "allergic" in text:
        return (
            "Please check with our restaurant staff "
            "about allergens before placing your order."
        )

    if "double" in text and "burger" in text:
        return "Try our Double Mr. Big for $9.15!"

    if "burger" in text or "recommend" in text:
        return (
            "I recommend our signature Mr. Big burger "
            "for $8.35!"
        )

    if "chicken" in text:
        return (
            "Try our Cluckin' Classic for $7.95, "
            "or explore our tenders and nuggets!"
        )

    if "vegetarian" in text or "veggie" in text:
        return (
            "We offer Veggie Single, Veggie Double, "
            "Mushroom Swiss, and Eggplant Parm."
        )

    if "fries" in text:
        return (
            "Our fries come in three sizes: "
            "Small $2.59, Medium $3.99, Large $4.79."
        )

    if "drink" in text or "coffee" in text:
        return (
            "We offer iced coffee, hot coffee, tea, "
            "hot chocolate, and soda."
        )

    if "reward" in text or "points" in text:
        return (
            "Visit the Rewards tab to check your "
            "points and redeem your favorite items!"
        )

    if "order" in text:
        return (
            "Visit the Order tab to customize your "
            "food and add items to your cart."
        )

    if "thank" in text:
        return "You're welcome! Stay hungry, stay BIG!"

    if text in ["hi", "hello", "hey"]:
        return (
            "Welcome to Mr. Big! I'm your virtual "
            "food assistant. How can I help you?"
        )

    return (
        "I can help you explore our menu, recommend "
        "food, explain prices, and find rewards!"
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

    reply = generate_reply(message)

    return Response({
        "reply": reply,
        "source": "python_backend"
    })
