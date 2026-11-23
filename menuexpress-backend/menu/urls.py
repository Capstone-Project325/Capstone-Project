from django.urls import path
from . import views

urlpatterns = [
    path("", views.menu_home, name="menu_home"),
    path("ai-recommendation/", views.ai_recommendation, name="ai_recommendation"),
]