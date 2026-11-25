
import os
from pathlib import Path
from google import genai
from google.genai import types


MODEL_NAME = "gemini-3.5-flash-lite"

PROMPT_PATH = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "chatbot_v2.txt"
)


def generate_ai_reply(message):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("Gemini API key is missing.")

    prompt = PROMPT_PATH.read_text(encoding="utf-8")

    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(
            timeout=10000
        )
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=message,
        config=types.GenerateContentConfig(
            system_instruction=prompt,
            temperature=0.2,
            max_output_tokens=512
        )
    )

    reply = response.text

    if not isinstance(reply, str) or not reply.strip():
        raise ValueError("Invalid AI response.")

    if len(reply.split()) > 100:
        raise ValueError("AI response is too long.")

    return reply.strip()
