"""
Sarvam Translate module for localizing alert texts and mandi labels.
"""

from typing import Dict, Any, Optional
from .client import sarvam_client

async def translate_text(
    input_text: str,
    source_lang: str = "en-IN",
    target_lang: str = "kn-IN",
    client: Optional[Any] = None,
) -> Dict[str, Any]:
    active_client = client or sarvam_client

    if active_client.use_mocks:
        return {
            "translated_text": input_text,
            "source_language_code": source_lang,
            "target_language_code": target_lang,
            "latency_ms": 110,
            "mode": "mock",
        }

    payload = {
        "input": input_text,
        "source_language_code": source_lang,
        "target_language_code": target_lang,
        "mode": "formal",
    }

    resp = await active_client.post_request(
        endpoint="/translate",
        json_data=payload,
    )

    data = resp.get("data", {})
    return {
        "translated_text": data.get("translated_text", input_text),
        "source_language_code": source_lang,
        "target_language_code": target_lang,
        "latency_ms": resp.get("latency_ms", 120),
        "mode": "live",
    }
