from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai_service import get_meal_recommendation
from .models import MenuItem

@api_view(['GET'])
def menu_home(request):
    items = MenuItem.objects.all()

    data = [
        {
            "id": str(item.id),
            "name": item.name,
            "description": item.description,
            "category": item.category,
            "price": str(item.price),
            "image": item.image,
            "is_available": item.is_available,
            "ingredients": item.ingredients,
            "allergens": item.allergens,
        }
        for item in items
    ]

    return Response({"items": data})


@api_view(['POST'])
def ai_recommendation(request):
    if not isinstance(request.data, dict):
        return Response({"error": "A JSON object with a preference is required."}, status=400)

    preference = request.data.get("preference")
    if not isinstance(preference, str) or not preference.strip():
        return Response({"error": "Preference must be a non-empty string."}, status=400)
    if len(preference) > 500:
        return Response({"error": "Preference must be 500 characters or fewer."}, status=400)

    try:
        return Response(get_meal_recommendation(preference))
    except ValueError:
        return Response({"error": "Preference must be a non-empty string of at most 500 characters."}, status=400)
    except Exception:
        return Response({"error": "Meal recommendations are temporarily unavailable."}, status=503)