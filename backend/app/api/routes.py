"""
FastAPI Routes for FasalRoute Backend.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from typing import Optional, List
import uuid

from ..engine.optimizer import optimize_harvest_split
from ..data.mandis import CANDIDATE_MANDIS, SEEDED_MARKET_RATES
from ..sarvam.stt import transcribe_audio
from ..sarvam.llm import execute_sarvam_105b_reasoning
from ..sarvam.tts import synthesize_speech
from ..sarvam.edge import offline_voice_provider
from ..sarvam.client import sarvam_client
from ..models.schemas import OptimizeRequest, VoiceDecisionRequest, AlertCreateRequest, JoinPoolRequest
from ..alerts.scheduler import ACTIVE_ALERTS

router = APIRouter(prefix="/api")

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "FasalRoute API",
        "version": "1.0.0",
        "team": "ex-ONYX",
        "use_mocks": sarvam_client.use_mocks,
    }

@router.post("/engine/optimize")
async def optimize_decision(req: OptimizeRequest):
    """Pure mathematical decision engine endpoint."""
    try:
        res = optimize_harvest_split(
            crop_id=req.crop_id,
            quantity_kg=req.quantity_kg,
            local_mandi_id=req.local_mandi_id,
            pool_discount_fraction=req.pool_discount_fraction,
            diesel_price=req.diesel_price,
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/voice/decision")
async def voice_decision_endpoint(
    audio_file: Optional[UploadFile] = File(None),
    query_text: Optional[str] = Form(None),
    language_code: str = Form("kn-IN"),
    local_mandi_id: str = Form("kolar"),
):
    """
    End-to-end Voice-In / Voice-Out Decision Pipeline:
    Saaras v4 (STT) -> Sarvam-105B (NLU & Tools) -> Engine -> Bulbul (TTS)
    """
    audio_bytes = None
    if audio_file:
        audio_bytes = await audio_file.read()

    # Step 1: Saaras v4 (STT)
    if audio_bytes:
        fname = audio_file.filename if audio_file and audio_file.filename else "audio.webm"
        stt_res = await transcribe_audio(
            audio_bytes=audio_bytes,
            language_code=language_code,
            filename=fname,
        )
        transcript = stt_res["transcript"]
    else:
        transcript = query_text or "2 tonnes of tomatoes in Kolar, what should I do?"
        stt_res = {
            "transcript": transcript,
            "detected_language": language_code,
            "model": "saaras:v4",
            "latency_ms": 235,
            "mode": "text_fallback",
        }

    # Step 2 & 3: Sarvam-105B & Engine
    llm_res = await execute_sarvam_105b_reasoning(
        transcript=transcript,
        language_code=language_code,
    )

    # Step 4: Bulbul (TTS)
    tts_res = await synthesize_speech(
        text=llm_res["spoken_decision_text"],
        language_code=language_code,
    )

    total_latency = (
        stt_res["latency_ms"]
        + llm_res["latency_ms"]["think"]
        + llm_res["latency_ms"]["engine"]
        + llm_res["latency_ms"]["write"]
        + tts_res["latency_ms"]
    )

    return {
        "transcript": transcript,
        "language_code": language_code,
        "intent": llm_res["intent"],
        "entities": llm_res["entities"],
        "tool_call": llm_res["tool_call"],
        "decision": llm_res["engine_output"],
        "spoken_text": llm_res["spoken_decision_text"],
        "validation_passed": llm_res["validation_passed"],
        "audio_base64": tts_res.get("audio_base64", ""),
        "audio_playback_url": tts_res["audio_url"],
        "telemetry": {
            "total_latency_ms": total_latency,
            "models": {
                "hear": {"model": "saaras:v4", "latency_ms": stt_res["latency_ms"]},
                "think": {"model": "sarvam-105b", "latency_ms": llm_res["latency_ms"]["think"]},
                "decide": {"model": "fasalroute-engine", "latency_ms": llm_res["latency_ms"]["engine"]},
                "write": {"model": "sarvam-105b", "latency_ms": llm_res["latency_ms"]["write"]},
                "speak": {"model": "bulbul:v4-flash", "latency_ms": tts_res["latency_ms"]},
            },
            "credits_used_estimate": 0.042,
            "mode": "live" if not sarvam_client.use_mocks else "mock",
        },
    }

@router.get("/mandis/compare")
async def get_mandi_comparison(crop: str = "tomato", quantity_kg: float = 2000.0):
    """Returns 5-mandi corridor comparison with net in-hand returns."""
    return optimize_harvest_split(crop_id=crop, quantity_kg=quantity_kg)

@router.get("/alerts")
async def get_alerts():
    """Returns active price alert monitors."""
    return ACTIVE_ALERTS

@router.post("/alerts")
async def create_alert(alert: AlertCreateRequest):
    """Registers a new farmer price threshold monitor."""
    new_alert = {
        "id": f"alert_{uuid.uuid4().hex[:6]}",
        "crop": alert.crop,
        "target_mandi": alert.target_mandi,
        "threshold_price": alert.threshold_price,
        "condition": alert.condition,
        "channel": alert.channel,
        "phone": alert.phone_number,
        "is_active": True,
        "last_triggered": None,
    }
    ACTIVE_ALERTS.insert(0, new_alert)
    return new_alert

@router.get("/groups/pools")
async def list_truck_pools():
    """Returns active FPO truck pooling logistics."""
    return [
        {
            "pool_id": "pool_kolar_tomato_daily",
            "title": "Kolar-to-Bengaluru Daily Tomato Pool",
            "crop": "tomato",
            "capacity_kg": 3000.0,
            "current_pooled_kg": 2200.0,
            "farmers_count": 3,
            "total_truck_freight": 2400.0,
            "cost_per_farmer": 600.0,
            "departure_time": "Tonight 09:30 PM",
            "target_mandi": "bengaluru_kr",
        }
    ]

@router.post("/groups/pools/{pool_id}/join")
async def join_truck_pool(pool_id: str, req: JoinPoolRequest):
    """Farmer joins an FPO truck pool."""
    return {
        "status": "joined",
        "pool_id": pool_id,
        "farmer_name": req.farmer_name,
        "offered_kg": req.offered_kg,
        "updated_farmers_count": 4,
        "new_split_cost": 600.0,
        "saving_rupees": 1800.0,
    }

@router.get("/sarvam/status")
async def get_sarvam_status():
    """Diagnostic telemetry on Sarvam AI endpoints and edge runtime."""
    return {
        "use_mocks": sarvam_client.use_mocks,
        "api_key_configured": bool(sarvam_client.api_key),
        "supported_languages": ["kn-IN", "hi-IN", "mr-IN", "ta-IN", "en-IN"],
        "models": {
            "stt": "saaras:v4",
            "llm": "sarvam-105b",
            "tts": "bulbul:v4-flash",
            "translate": "sarvam:translate",
        },
        "edge_provider": offline_voice_provider.get_status(),
    }
