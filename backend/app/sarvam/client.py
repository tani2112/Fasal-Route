"""
Sarvam AI Unified Client.
Handles authentication, timeouts, retries, latency telemetry, and mock fallback.
"""

import os
import time
import logging
from typing import Dict, Any, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("fasalroute.sarvam")

SARVAM_BASE_URL = "https://api.sarvam.ai"
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
USE_MOCKS = os.getenv("USE_MOCKS", "true").lower() in ("true", "1", "yes")

class SarvamClient:
    def __init__(self, api_key: Optional[str] = None, use_mocks: Optional[bool] = None):
        self.api_key = api_key if api_key is not None else SARVAM_API_KEY
        self.use_mocks = use_mocks if use_mocks is not None else USE_MOCKS
        if not self.api_key:
            self.use_mocks = True

        self.headers = {
            "api-subscription-key": self.api_key,
        }
        self.timeout = httpx.Timeout(20.0, connect=5.0)

    async def post_request(
        self,
        endpoint: str,
        json_data: Optional[Dict[str, Any]] = None,
        files: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Executes a POST request to Sarvam AI with latency logging and retries.
        """
        url = f"{SARVAM_BASE_URL}{endpoint}"
        start_time = time.time()

        for attempt in range(2): # 1 retry
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    if files:
                        resp = await client.post(url, headers=self.headers, files=files, data=data)
                    else:
                        resp = await client.post(url, headers={**self.headers, "Content-Type": "application/json"}, json=json_data)

                    resp.raise_for_status()
                    duration_ms = round((time.time() - start_time) * 1000)
                    return {
                        "status": "success",
                        "data": resp.json(),
                        "latency_ms": duration_ms,
                    }
            except Exception as e:
                logger.warning(f"Sarvam call to {endpoint} attempt {attempt+1} failed: {e}")
                if attempt == 1:
                    raise e
                time.sleep(0.5)

sarvam_client = SarvamClient()
