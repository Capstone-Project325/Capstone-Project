from rest_framework.decorators import api_view
from rest_framework.response import Response
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
        }
        for item in items

    ]

    return Response({"items": data})
