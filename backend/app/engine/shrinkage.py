"""
Shrinkage loss model for agricultural transport.
Shrinkage = f(shelf life, travel time, crop, road quality)
"""

from typing import Dict, Any

CROP_SHRINKAGE_PROFILES = {
    "tomato": {
        "shelf_life_hours": 48.0,
        "base_hourly_loss_rate": 0.012, # 1.2% per hour under rural transit
        "max_shrinkage_pct": 0.08,
    },
    "onion": {
        "shelf_life_hours": 360.0,
        "base_hourly_loss_rate": 0.002,
        "max_shrinkage_pct": 0.03,
    },
    "potato": {
        "shelf_life_hours": 720.0,
        "base_hourly_loss_rate": 0.001,
        "max_shrinkage_pct": 0.02,
    },
}

def calculate_shrinkage(
    crop_id: str,
    travel_time_hours: float,
    quantity_kg: float,
    price_per_kg: float,
    road_quality_factor: float = 1.0,
    custom_shelf_life: float = None,
) -> Dict[str, Any]:
    """
    Computes transit shrinkage loss in kg, percentage, and rupees.
    """
    if travel_time_hours <= 0 or quantity_kg <= 0:
        return {
            "shrinkage_kg": 0.0,
            "shrinkage_rupees": 0.0,
            "shrinkage_pct": 0.0,
        }

    profile = CROP_SHRINKAGE_PROFILES.get(
        crop_id.lower(),
        {
            "shelf_life_hours": 48.0,
            "base_hourly_loss_rate": 0.01,
            "max_shrinkage_pct": 0.08,
        },
    )

    shelf_life = custom_shelf_life if custom_shelf_life else profile["shelf_life_hours"]
    shelf_life_stress = min(2.0, 48.0 / max(12.0, shelf_life))
    hourly_rate = profile["base_hourly_loss_rate"] * road_quality_factor

    shrinkage_pct = min(
        profile["max_shrinkage_pct"],
        travel_time_hours * hourly_rate * shelf_life_stress,
    )

    shrinkage_kg = round(quantity_kg * shrinkage_pct, 1)
    shrinkage_rupees = round(shrinkage_kg * price_per_kg, 2)

    return {
        "shrinkage_kg": shrinkage_kg,
        "shrinkage_rupees": shrinkage_rupees,
        "shrinkage_pct": round(shrinkage_pct * 100, 2),
    }
