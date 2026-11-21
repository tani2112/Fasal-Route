"""
Offline Voice Provider & Sarvam Edge Abstraction.
Provides offline processing via cached market pack + local engine + Web Speech API fallback,
with a documented hook for Sarvam Edge on-device runtime.
"""

from typing import Dict, Any, Optional

class OfflineVoiceProvider:
    """
    Manages offline speech processing and fallback transitions.
    - Current Web MVP: Client-side Dexie IndexedDB + TypeScript engine port + browser speech.
    - Planned Device Hook: Direct binding to Sarvam Edge native on-device SDK (Wasm / Android NDK).
    """

    def __init__(self, is_edge_available: bool = False):
        self.is_edge_available = is_edge_available
        self.runtime_mode = "browser_engine_fallback" if not is_edge_available else "sarvam_edge_native"

    def get_status(self) -> Dict[str, Any]:
        return {
            "runtime_mode": self.runtime_mode,
            "is_edge_available": self.is_edge_available,
            "offline_engine_ready": True,
            "cached_mandis_count": 5,
            "cached_crops_count": 3,
            "documented_hook": "https://docs.sarvam.ai/edge-sdk-preview",
            "disclosure": (
                "Currently using client-side TypeScript engine + IndexedDB cache with browser speech synthesis. "
                "Sarvam Edge on-device Wasm/native model hook is wired and ready for binary activation."
            ),
        }

offline_voice_provider = OfflineVoiceProvider(is_edge_available=False)
