
from django.urls import path
from .views import customize_item

urlpatterns = [
    path("customize/", customize_item, name="customize_item"),
]
