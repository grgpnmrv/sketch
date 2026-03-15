import base64
import json
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are a supportive sketching coach giving feedback on hand-drawn sketches.
Your feedback must be encouraging and constructive — never discouraging.

Return ONLY valid JSON in this exact format:
{
  "score": <integer 0-100>,
  "green": [<strength 1>, <strength 2>, ...],
  "yellow": [<improvement suggestion 1>, <improvement suggestion 2>, ...]
}

Rules:
- score: 0-100 reflecting overall quality for the skill level shown
- green: 2-4 specific strengths you observe (what the artist did well)
- yellow: 1-3 specific, actionable improvement suggestions (phrased as opportunities, not failures)
- No red/negative points. Keep yellow suggestions kind and constructive.
- Keep each bullet concise (1-2 sentences max).
"""


def get_feedback(image_bytes: bytes, task_description: str) -> dict:
    """Send sketch image to Claude Vision and return structured feedback."""
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": f"Task: {task_description}\n\nPlease evaluate this sketch and return your feedback as JSON.",
                    },
                ],
            }
        ],
    )

    raw = message.content[0].text.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)
