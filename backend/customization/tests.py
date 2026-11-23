
from django.test import TestCase
from rest_framework.test import APIClient


class CustomizationTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = "/api/customize/"

    def test_get_menu(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("menu", response.data)
        self.assertIn("cheeseburger", response.data["menu"])

    def test_valid_customization(self):
        response = self.client.post(
            self.url,
            {
                "item": "cheeseburger",
                "variant": "single",
                "extras": ["bacon", "extra_cheese"],
                "remove_ingredients": ["pickles"],
                "combo": "none",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_price"], 5.24)

    def test_combo_pricing(self):
        response = self.client.post(
            self.url,
            {
                "item": "cheeseburger",
                "variant": "double",
                "extras": ["bacon", "extra_cheese"],
                "remove_ingredients": ["pickles"],
                "combo": "medium",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_price"], 10.69)

    def test_invalid_topping(self):
        response = self.client.post(
            self.url,
            {
                "item": "soft_drink",
                "variant": "small",
                "extras": ["bacon"],
                "remove_ingredients": [],
                "combo": "none",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_duplicate_toppings(self):
        response = self.client.post(
            self.url,
            {
                "item": "cheeseburger",
                "variant": "single",
                "extras": ["bacon", "bacon"],
                "remove_ingredients": [],
                "combo": "none",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_variant(self):
        response = self.client.post(
            self.url,
            {
                "item": "cheeseburger",
                "variant": "triple",
                "extras": [],
                "remove_ingredients": [],
                "combo": "none",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_item(self):
        response = self.client.post(
            self.url,
            {
                "item": "pizza",
                "variant": "regular",
                "extras": [],
                "remove_ingredients": [],
                "combo": "none",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
