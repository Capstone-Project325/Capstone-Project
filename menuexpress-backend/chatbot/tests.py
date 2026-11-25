
from unittest.mock import patch
from rest_framework.test import APISimpleTestCase


class ChatbotTests(APISimpleTestCase):

    @patch("chatbot.views.generate_ai_reply")
    def test_ai_success(self, mock_ai):
        mock_ai.return_value = "Try our Mr. Big for $8.35!"

        response = self.client.post(
            "/api/chatbot/",
            {"message": "Recommend a burger"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "gemini_ai")
        self.assertEqual(
            response.data["reply"],
            "Try our Mr. Big for $8.35!"
        )
        mock_ai.assert_called_once()

    @patch("chatbot.views.generate_ai_reply")
    def test_api_failure(self, mock_ai):
        mock_ai.side_effect = RuntimeError("API unavailable")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "Recommend a burger"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("$8.35", response.data["reply"])

    @patch("chatbot.views.generate_ai_reply")
    def test_api_timeout(self, mock_ai):
        mock_ai.side_effect = TimeoutError("Request timed out")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "What fries do you have?"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("$2.59", response.data["reply"])

    @patch("chatbot.views.generate_ai_reply")
    def test_invalid_ai_response(self, mock_ai):
        mock_ai.side_effect = ValueError("Invalid AI response")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "What vegetarian options do you have?"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("Veggie Single", response.data["reply"])

    @patch("chatbot.views.generate_ai_reply")
    def test_empty_message(self, mock_ai):
        response = self.client.post(
            "/api/chatbot/",
            {"message": ""},
            format="json"
        )

        self.assertEqual(response.status_code, 400)
        mock_ai.assert_not_called()

    @patch("chatbot.views.generate_ai_reply")
    def test_long_message(self, mock_ai):
        response = self.client.post(
            "/api/chatbot/",
            {"message": "a" * 1001},
            format="json"
        )

        self.assertEqual(response.status_code, 400)
        mock_ai.assert_not_called()

    @patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"})
    @patch("chatbot.ai_service.genai.Client")
    def test_empty_ai_output(self, mock_client):
        from chatbot.ai_service import generate_ai_reply

        mock_client.return_value.models.generate_content.return_value.text = ""

        with self.assertRaises(ValueError):
            generate_ai_reply("Hello")

    @patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"})
    @patch("chatbot.ai_service.genai.Client")
    def test_excessive_ai_output(self, mock_client):
        from chatbot.ai_service import generate_ai_reply

        mock_client.return_value.models.generate_content.return_value.text = "word " * 101

        with self.assertRaises(ValueError):
            generate_ai_reply("Hello")
    @patch("chatbot.views.generate_ai_reply")
    def test_budget_fallback(self, mock_ai):
        mock_ai.side_effect = RuntimeError("API unavailable")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "Recommend a burger under $5"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("budget", response.data["reply"])
        self.assertNotIn("$8.35", response.data["reply"])

    @patch("chatbot.views.generate_ai_reply")
    def test_vegetarian_fallback(self, mock_ai):
        mock_ai.side_effect = RuntimeError("API unavailable")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "Recommend a vegetarian burger"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("Veggie Single", response.data["reply"])
        self.assertNotIn("Mr. Big burger", response.data["reply"])

    @patch("chatbot.views.generate_ai_reply")
    def test_allergy_fallback(self, mock_ai):
        mock_ai.side_effect = RuntimeError("API unavailable")

        response = self.client.post(
            "/api/chatbot/",
            {"message": "I have a peanut allergy"},
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["source"], "python_fallback")
        self.assertIn("cross-contamination", response.data["reply"])
        self.assertIn("cannot guarantee", response.data["reply"])
        self.assertIn("restaurant staff", response.data["reply"])