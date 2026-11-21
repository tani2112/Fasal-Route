"""
Transport and freight cost calculations including diesel rates and neighbour pooling.
"""

DIESEL_PRICE_PER_LITER = 92.0
DEFAULT_FREIGHT_PER_KM = 14.0 # ₹14/km mini-truck (Piaggio Ape / Tata Ace harvest freight)

def calculate_transport_cost(
    distance_km: float,
    quantity_kg: float,
    freight_rate_per_km: float = DEFAULT_FREIGHT_PER_KM,
    pool_discount_fraction: float = 0.0,
    diesel_price: float = DIESEL_PRICE_PER_LITER,
) -> float:
    """
    Computes freight transport cost in Rupees.
    If pooled (group selling), cost is split proportionally.
    """
    if distance_km <= 0 or quantity_kg <= 0:
        return 0.0

    # Diesel adjustment factor (base 92.0)
    diesel_factor = diesel_price / 92.0
    effective_rate = freight_rate_per_km * diesel_factor

    solo_cost = round(distance_km * effective_rate, 2)

    if pool_discount_fraction > 0.0:
        # Farmer shares vehicle with neighbours
        discounted = solo_cost * (1.0 - pool_discount_fraction)
        return round(max(150.0, discounted), 2)

    return solo_cost
