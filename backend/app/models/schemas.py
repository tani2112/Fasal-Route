"""
Pydantic data validation schemas for FasalRoute API.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class OptimizeRequest(BaseModel):
    crop_id: str = Field(..., example="tomato")
    quantity_kg: float = Field(..., gt=0, example=2000.0)
    local_mandi_id: str = Field(default="kolar", example="kolar")
    pool_discount_fraction: float = Field(default=0.0, ge=0.0, le=0.9, example=0.0)
    diesel_price: float = Field(default=92.0, example=92.0)

class VoiceDecisionRequest(BaseModel):
    query_text: Optional[str] = Field(default=None, example="2 tonnes of tomatoes in Kolar, what should I do?")
    language_code: str = Field(default="kn-IN", example="kn-IN")
    local_mandi_id: str = Field(default="kolar")

class AlertCreateRequest(BaseModel):
    crop: str = Field(..., example="tomato")
    target_mandi: str = Field(..., example="bengaluru_kr")
    threshold_price: float = Field(..., example=2200.0)
    condition: str = Field(default="above", example="above")
    channel: str = Field(default="whatsapp", example="whatsapp")
    phone_number: Optional[str] = Field(default="+919876543210")

class JoinPoolRequest(BaseModel):
    pool_id: str = Field(..., example="pool_kolar_tomato_daily")
    farmer_name: str = Field(..., example="Ramesh Gowda")
    offered_kg: float = Field(..., gt=0, example=800.0)
    phone_number: str = Field(default="+919876543210")
