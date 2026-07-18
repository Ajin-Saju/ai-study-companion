import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
print("DEBUG KEY LOADED:", repr(os.getenv("GEMINI_API_KEY")))
# Gemini's OpenAI-compatible endpoint: same OpenAI SDK, different base_url + key.
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

EXPLAIN_PROMPT = """You are a clear, encouraging tutor. Explain the following study material in simple terms. Use short headers and bullet points where useful. Keep it focused.

MATERIAL:
{text}"""

SUMMARY_PROMPT = """Summarize the following study material into a concise chapter summary with 5 to 8 key bullet points capturing the most important ideas.

MATERIAL:
{text}"""

QUIZ_PROMPT = """Based on the study material below, write a short quiz with exactly 5 questions of mixed types (short_answer and true_false). Return STRICT JSON only, no markdown formatting, matching exactly this schema:
{{
  "questions": [
    {{"question": "string", "type": "short_answer", "answer": "string"}}
  ]
}}

MATERIAL:
{text}"""

FLASHCARDS_PROMPT = """Based on the study material below, generate exactly 8 flashcards. Return STRICT JSON only matching exactly this schema:
{{
  "flashcards": [
    {{"term": "string", "definition": "string"}}
  ]
}}

MATERIAL:
{text}"""

MCQ_PROMPT = """Based on the study material below, generate exactly 5 multiple-choice questions, each with exactly 4 options. Return STRICT JSON only matching exactly this schema:
{{
  "questions": [
    {{"question": "string", "options": ["string", "string", "string", "string"], "correct_index": 0}}
  ]
}}

MATERIAL:
{text}"""

ASSIGNMENT_PROMPT = """Based on the study material below, generate exactly 3 open-ended assignment prompts that test deeper understanding. Return STRICT JSON only matching exactly this schema:
{{
  "assignments": [
    {{"title": "string", "prompt": "string"}}
  ]
}}

MATERIAL:
{text}"""

def generate_json(prompt: str) -> dict:
    """Call Gemini (via OpenAI-compatible endpoint), force JSON output, parse it. Retries once on parse failure."""
    for attempt in range(2):
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You always respond with strict, valid JSON only. No markdown, no code fences, no extra commentary."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            if attempt == 1:
                raise
    return {}

def stream_text(prompt: str):
    """Yield text chunks as they arrive from Gemini, for SSE streaming."""
    stream = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta