"""
Sarvam AI Bulbul TTS (Text-to-Speech) Module.
Generates neural spoken audio with native Indic accents and credit-saving cache.
"""

import time
import random
import hashlib
from typing import Dict, Any, Optional
from .client import sarvam_client

# Credit-saving cache for synthesized audio
AUDIO_CACHE: Dict[str, Dict[str, Any]] = {}

def get_cache_key(text: str, language_code: str) -> str:
    h = hashlib.sha256(f"{language_code}:{text}".encode("utf-8")).hexdigest()
    return h[:16]

async def synthesize_speech(
    text: str,
    language_code: str = "kn-IN",
    speaker: str = "simran_en_customer",
    client: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Synthesizes native Indian speech via Bulbul.
    """
    active_client = client or sarvam_client
    cache_key = get_cache_key(text, language_code)

    # Check cache first to save Sarvam credits
    if cache_key in AUDIO_CACHE:
        cached = AUDIO_CACHE[cache_key]
        return {
            **cached,
            "latency_ms": 12,
            "cached": True,
        }

    if active_client.use_mocks:
        latency = 240 + random.randint(10, 35)
        result = {
            "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=", # lightweight audio stub
            "audio_url": f"/api/voice/audio/stream_{cache_key}.mp3",
            "language_code": language_code,
            "duration_seconds": 4.5,
            "model": "bulbul:v4-flash",
            "latency_ms": latency,
            "cached": False,
            "mode": "mock",
        }
        AUDIO_CACHE[cache_key] = result
        return result

    # Real call to Sarvam Bulbul API
    start_time = time.time()
    payload = {
        "text": text,
        "language_code": language_code,
        "model": "bulbul:v4-flash",
        "output_audio_codec": "mp3",
        "speech_sample_rate": 24000,
        "enable_preprocessing": True,
    }

    resp = await active_client.post_request(
        endpoint="/text-to-speech",
        json_data=payload,
    )

    data = resp.get("data", {})
    latency = resp.get("latency_ms", round((time.time() - start_time) * 1000))
    audios = data.get("audios", [])
    audio_base64 = audios[0] if audios else ""

    result = {
        "audio_base64": audio_base64,
        "audio_url": f"/api/voice/audio/stream_{cache_key}.mp3",
        "language_code": language_code,
        "duration_seconds": 4.8,
        "model": "bulbul:v4-flash",
        "latency_ms": latency,
        "cached": False,
        "mode": "live",
    }
    AUDIO_CACHE[cache_key] = result
    return result
