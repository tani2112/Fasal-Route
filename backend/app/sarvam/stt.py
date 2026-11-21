"""
Sarvam AI Saaras v4 Speech-to-Text Module.
Transcribes audio into text with native Indian code-mix capabilities.
"""

import time
import random
from typing import Dict, Any, Optional
from .client import sarvam_client

async def transcribe_audio(
    audio_bytes: bytes,
    language_code: str = "kn-IN",
    filename: str = "audio.webm",
    client: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Transcribes audio using Saaras v4.
    """
    active_client = client or sarvam_client

    if active_client.use_mocks or not audio_bytes:
        # Mock Saaras v4 response for Phase 1/Phase 2 test
        latency = 230 + random.randint(10, 40)
        return {
            "transcript": "2 tonnes of tomatoes in Kolar, what should I do?",
            "detected_language": language_code,
            "confidence": 0.96,
            "model": "saaras:v4",
            "latency_ms": latency,
            "mode": "mock",
        }

    # Real call to Sarvam Saaras v4 API
    start_time = time.time()
    mime = "audio/webm" if "webm" in filename else "audio/wav"
    files = {"file": (filename, audio_bytes, mime)}
    data = {
        "model": "saaras:v4",
        "language-code": language_code,
        "mode": "codemix",
    }

    resp = await active_client.post_request(
        endpoint="/speech-to-text",
        files=files,
        data=data,
    )

    data_payload = resp.get("data", {})
    latency = resp.get("latency_ms", round((time.time() - start_time) * 1000))

    return {
        "transcript": data_payload.get("transcript", ""),
        "detected_language": data_payload.get("language_code", language_code),
        "confidence": data_payload.get("confidence", 0.95),
        "model": "saaras:v4",
        "latency_ms": latency,
        "mode": "live",
    }
