"""
Core net profit calculation module.
net_profit(mandi) = (price_at_mandi − price_local) × quantity − transport_cost − shrinkage_loss − fees
"""

from typing import Dict, Any
from .shrinkage import calculate_shrinkage
from .transport import calculate_transport_cost

def calculate_mandi_net_profit(
    crop_id: str,
    quantity_kg: float,
    mandi_price_per_qtl: float,
    local_price_per_qtl: float,
    distance_km: float,
    travel_time_hours: float,
    commission_rate: float = 0.015,
    road_quality_factor: float = 1.0,
    pool_discount_fraction: float = 0.0,
    diesel_price: float = 92.0,
) -> Dict[str, Any]:
    """
    Computes exact net financial return and cost deductions for sending a harvest load to a candidate mandi.
    """
    if quantity_kg <= 0:
        raise ValueError("Quantity must be greater than zero kg.")

    price_per_kg = mandi_price_per_qtl / 100.0
    local_price_per_kg = local_price_per_qtl / 100.0

    gross_revenue = round(quantity_kg * price_per_kg, 2)
    local_gross = round(quantity_kg * local_price_per_kg, 2)

    transport_cost = calculate_transport_cost(
        distance_km=distance_km,
        quantity_kg=quantity_kg,
        pool_discount_fraction=pool_discount_fraction,
        diesel_price=diesel_price,
    )

    shrinkage_result = calculate_shrinkage(
        crop_id=crop_id,
        travel_time_hours=travel_time_hours,
        quantity_kg=quantity_kg,
        price_per_kg=price_per_kg,
        road_quality_factor=road_quality_factor,
    )

    fees = round(gross_revenue * commission_rate, 2)
    shrinkage_rupees = shrinkage_result["shrinkage_rupees"]

    # Net in hand
    net_in_hand = round(gross_revenue - transport_cost - shrinkage_rupees - fees, 2)

    # Net gain vs selling locally (local has 0 transport, 0 shrinkage, but local commission)
    local_fees = round(local_gross * commission_rate, 2)
    baseline_local_net = round(local_gross - local_fees, 2)
    net_gain_vs_local = round(net_in_hand - baseline_local_net, 2)

    net_per_qtl = round((net_in_hand / quantity_kg) * 100.0, 2)

    return {
        "gross_revenue": gross_revenue,
        "transport_cost": transport_cost,
        "shrinkage_kg": shrinkage_result["shrinkage_kg"],
        "shrinkage_rupees": shrinkage_rupees,
        "shrinkage_pct": shrinkage_result["shrinkage_pct"],
        "fees": fees,
        "net_in_hand": net_in_hand,
        "baseline_local_net": baseline_local_net,
        "net_gain_vs_local": net_gain_vs_local,
        "net_per_qtl": net_per_qtl,
    }
