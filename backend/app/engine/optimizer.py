"""
FasalRoute Harvest Decision Optimizer.
Compares 5 mandis and produces optimal risk-hedged split allocations.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from .profit import calculate_mandi_net_profit
from ..data.mandis import CANDIDATE_MANDIS, SEEDED_MARKET_RATES

def optimize_harvest_split(
    crop_id: str,
    quantity_kg: float,
    local_mandi_id: str = "kolar",
    custom_mandi_rates: Optional[Dict[str, float]] = None,
    pool_discount_fraction: float = 0.0,
    diesel_price: float = 92.0,
    data_freshness_minutes: int = 18,
) -> Dict[str, Any]:
    """
    Evaluates 5 mandis and returns the risk-hedged allocation recommendation.
    """
    if quantity_kg <= 0:
        raise ValueError("Harvest quantity must be strictly greater than zero kg.")

    norm_crop = crop_id.lower().strip()
    rates_for_crop = (
        custom_mandi_rates
        if custom_mandi_rates
        else SEEDED_MARKET_RATES.get(norm_crop, SEEDED_MARKET_RATES["tomato"])
    )

    local_mandi = CANDIDATE_MANDIS.get(local_mandi_id, CANDIDATE_MANDIS["kolar"])
    local_rate = rates_for_crop.get(local_mandi["id"], 1850.0)
    local_price_per_kg = local_rate / 100.0

    # 1. Baseline local earnings (100% sold locally)
    local_gross = round(quantity_kg * local_price_per_kg, 2)
    local_fees = round(local_gross * local_mandi["commission_rate"], 2)
    baseline_local_net = round(local_gross - local_fees, 2)

    # 2. Evaluate all 5 candidate mandis for full load
    per_mandi_breakdown: List[Dict[str, Any]] = []
    best_distant_mandi = None
    max_distant_net = -float("inf")

    for mandi_id, mandi in CANDIDATE_MANDIS.items():
        rate = rates_for_crop.get(mandi_id, local_rate)
        profit_calc = calculate_mandi_net_profit(
            crop_id=norm_crop,
            quantity_kg=quantity_kg,
            mandi_price_per_qtl=rate,
            local_price_per_qtl=local_rate,
            distance_km=mandi["distance_km"],
            travel_time_hours=mandi["travel_time_hours"],
            commission_rate=mandi["commission_rate"],
            road_quality_factor=mandi["road_quality_factor"],
            pool_discount_fraction=pool_discount_fraction,
            diesel_price=diesel_price,
        )

        row = {
            "mandi_id": mandi["id"],
            "mandi_name": mandi["name"],
            "mandi_name_kn": mandi["name_kn"],
            "mandi_name_hi": mandi["name_hi"],
            "distance_km": mandi["distance_km"],
            "travel_time_hours": mandi["travel_time_hours"],
            "price_per_quintal": rate,
            "transport_cost": profit_calc["transport_cost"],
            "shrinkage_kg": profit_calc["shrinkage_kg"],
            "shrinkage_rupees": profit_calc["shrinkage_rupees"],
            "fees": profit_calc["fees"],
            "net_in_hand": profit_calc["net_in_hand"],
            "net_gain_vs_local": profit_calc["net_gain_vs_local"],
            "net_per_qtl": profit_calc["net_per_qtl"],
            "is_local": mandi["id"] == local_mandi["id"],
            "is_best": False,
        }
        per_mandi_breakdown.append(row)

        if not row["is_local"] and row["net_in_hand"] > max_distant_net:
            max_distant_net = row["net_in_hand"]
            best_distant_mandi = row

    # Mark best overall
    best_overall = max(per_mandi_breakdown, key=lambda x: x["net_in_hand"])
    for r in per_mandi_breakdown:
        r["is_best"] = r["mandi_id"] == best_overall["mandi_id"]

    # 3. Decision Split Logic
    # If best distant mandi provides >= ₹1,000 net gain over local:
    # Hedge: 40% local same-day cash, 60% dispatched to best distant mandi
    split: List[Dict[str, Any]] = []
    is_distant_lucrative = best_distant_mandi and (
        best_distant_mandi["net_in_hand"] > baseline_local_net + 1000.0
    )

    if is_distant_lucrative:
        target_mandi = CANDIDATE_MANDIS[best_distant_mandi["mandi_id"]]
        local_ratio = 0.40
        distant_ratio = 0.60

        local_qty = round(quantity_kg * local_ratio, 1)
        distant_qty = round(quantity_kg - local_qty, 1)

        # Local segment
        local_seg_gross = round(local_qty * local_price_per_kg, 2)
        local_seg_fees = round(local_seg_gross * local_mandi["commission_rate"], 2)
        local_seg_net = round(local_seg_gross - local_seg_fees, 2)

        # Distant segment
        distant_rate = rates_for_crop.get(target_mandi["id"], local_rate)
        distant_price_kg = distant_rate / 100.0
        distant_seg_gross = round(distant_qty * distant_price_kg, 2)

        distant_calc = calculate_mandi_net_profit(
            crop_id=norm_crop,
            quantity_kg=distant_qty,
            mandi_price_per_qtl=distant_rate,
            local_price_per_qtl=local_rate,
            distance_km=target_mandi["distance_km"],
            travel_time_hours=target_mandi["travel_time_hours"],
            commission_rate=target_mandi["commission_rate"],
            road_quality_factor=target_mandi["road_quality_factor"],
            pool_discount_fraction=pool_discount_fraction,
            diesel_price=diesel_price,
        )

        recommended_total_net = round(local_seg_net + distant_calc["net_in_hand"], 2)
        net_gain_vs_local = round(recommended_total_net - baseline_local_net, 2)

        split = [
            {
                "mandi_id": local_mandi["id"],
                "mandiId": local_mandi["id"],
                "mandi_name": local_mandi["name"],
                "mandiName": local_mandi["name"],
                "mandi_name_kn": local_mandi["name_kn"],
                "mandiNameKn": local_mandi["name_kn"],
                "mandi_name_hi": local_mandi["name_hi"],
                "mandiNameHi": local_mandi["name_hi"],
                "percentage": 40,
                "allocated_kg": local_qty,
                "allocatedKg": local_qty,
                "expected_gross_rupees": local_seg_gross,
                "expectedGrossRupees": local_seg_gross,
                "transport_cost_rupees": 0.0,
                "transportCostRupees": 0.0,
                "shrinkage_kg": 0.0,
                "shrinkageKg": 0.0,
                "shrinkage_rupees": 0.0,
                "shrinkageRupees": 0.0,
                "fees_rupees": local_seg_fees,
                "feesRupees": local_seg_fees,
                "net_in_hand_rupees": local_seg_net,
                "netInHandRupees": local_seg_net,
                "rate_per_quintal": local_rate,
                "ratePerQuintal": local_rate,
                "distance_km": 0.0,
                "distanceKm": 0.0,
                "travel_time_hours": 0.0,
                "travelTimeHours": 0.0,
                "is_local": True,
                "isLocal": True,
            },
            {
                "mandi_id": target_mandi["id"],
                "mandiId": target_mandi["id"],
                "mandi_name": target_mandi["name"],
                "mandiName": target_mandi["name"],
                "mandi_name_kn": target_mandi["name_kn"],
                "mandiNameKn": target_mandi["name_kn"],
                "mandi_name_hi": target_mandi["name_hi"],
                "mandiNameHi": target_mandi["name_hi"],
                "percentage": 60,
                "allocated_kg": distant_qty,
                "allocatedKg": distant_qty,
                "expected_gross_rupees": distant_seg_gross,
                "expectedGrossRupees": distant_seg_gross,
                "transport_cost_rupees": distant_calc["transport_cost"],
                "transportCostRupees": distant_calc["transport_cost"],
                "shrinkage_kg": distant_calc["shrinkage_kg"],
                "shrinkageKg": distant_calc["shrinkage_kg"],
                "shrinkage_rupees": distant_calc["shrinkage_rupees"],
                "shrinkageRupees": distant_calc["shrinkage_rupees"],
                "fees_rupees": distant_calc["fees"],
                "feesRupees": distant_calc["fees"],
                "net_in_hand_rupees": distant_calc["net_in_hand"],
                "netInHandRupees": distant_calc["net_in_hand"],
                "rate_per_quintal": distant_rate,
                "ratePerQuintal": distant_rate,
                "distance_km": target_mandi["distance_km"],
                "distanceKm": target_mandi["distance_km"],
                "travel_time_hours": target_mandi["travel_time_hours"],
                "travelTimeHours": target_mandi["travel_time_hours"],
                "is_local": False,
                "isLocal": False,
            },
        ]

        summary_en = (
            f"Sell 40% ({int(local_qty)} kg) at {local_mandi['name']} today for instant cash. "
            f"Send 60% ({int(distant_qty)} kg) to {target_mandi['name']} ({target_mandi['distance_km']} km away) "
            f"for an extra net profit of +₹{int(net_gain_vs_local):,}."
        )
        summary_kn = (
            f"ಇಂದು ೪೦% ({int(local_qty)} ಕೆಜಿ) ಸ್ಥಳೀಯ {local_mandi['name_kn']}ದಲ್ಲಿ ಮಾರಿ. "
            f"ಉಳಿದ ೬೦% ({int(distant_qty)} ಕೆಜಿ) ಅನ್ನು {target_mandi['name_kn']}ಗೆ ಕಳುಹಿಸಿ, "
            f"ಇದರಿಂದ ನಿಮಗೆ +₹{int(net_gain_vs_local):,} ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ."
        )
        summary_hi = (
            f"आज ४०% ({int(local_qty)} किग्रा) स्थानीय {local_mandi['name_hi']} में बेचें। "
            f"शेष ६०% ({int(distant_qty)} किग्रा) {target_mandi['name_hi']} भेजें, "
            f"जिससे आपको +₹{int(net_gain_vs_local):,} का शुद्ध अतिरिक्त लाभ होगा।"
        )
    else:
        # All distant mandis worse or not worth the transport + shrinkage
        recommended_total_net = baseline_local_net
        net_gain_vs_local = 0.0
        split = [
            {
                "mandi_id": local_mandi["id"],
                "mandiId": local_mandi["id"],
                "mandi_name": local_mandi["name"],
                "mandiName": local_mandi["name"],
                "mandi_name_kn": local_mandi["name_kn"],
                "mandiNameKn": local_mandi["name_kn"],
                "mandi_name_hi": local_mandi["name_hi"],
                "mandiNameHi": local_mandi["name_hi"],
                "percentage": 100,
                "allocated_kg": quantity_kg,
                "allocatedKg": quantity_kg,
                "expected_gross_rupees": local_gross,
                "expectedGrossRupees": local_gross,
                "transport_cost_rupees": 0.0,
                "transportCostRupees": 0.0,
                "shrinkage_kg": 0.0,
                "shrinkageKg": 0.0,
                "shrinkage_rupees": 0.0,
                "shrinkageRupees": 0.0,
                "fees_rupees": local_fees,
                "feesRupees": local_fees,
                "net_in_hand_rupees": baseline_local_net,
                "netInHandRupees": baseline_local_net,
                "rate_per_quintal": local_rate,
                "ratePerQuintal": local_rate,
                "distance_km": 0.0,
                "distanceKm": 0.0,
                "travel_time_hours": 0.0,
                "travelTimeHours": 0.0,
                "is_local": True,
                "isLocal": True,
            }
        ]
        summary_en = (
            f"Sell 100% ({int(quantity_kg)} kg) at local {local_mandi['name']} today. "
            f"Distant mandi premiums do not cover freight and transit shrinkage."
        )
        summary_kn = (
            f"ಇಂದು ಸಂಪೂರ್ಣ ೧೦೦% ({int(quantity_kg)} ಕೆಜಿ) ಸ್ಥಳೀಯ {local_mandi['name_kn']}ದಲ್ಲೇ ಮಾರಿ. "
            f"ದೂರದ ಮಂಡಿಯ ದರವು ಸಾರಿಗೆ ಮತ್ತು ಕೊಳೆತ ನಷ್ಟವನ್ನು ಸರಿದೂಗಿಸುವುದಿಲ್ಲ."
        )
        summary_hi = (
            f"आज पूरा १००% ({int(quantity_kg)} किग्रा) स्थानीय {local_mandi['name_hi']} में ही बेचें। "
            f"दूर की मंडी का भाव ढुलाई और वजन कमी की भरपाई नहीं करता।"
        )

    is_stale = data_freshness_minutes > 180

    return {
        "crop": norm_crop,
        "cropName": norm_crop.upper(),
        "quantity_kg": quantity_kg,
        "totalQuantityKg": quantity_kg,
        "local_mandi_id": local_mandi["id"],
        "localMandiId": local_mandi["id"],
        "local_mandi_name": local_mandi["name"],
        "localMandiName": local_mandi["name"],
        "baseline_local_net": baseline_local_net,
        "baselineLocalNetRupees": baseline_local_net,
        "recommended_total_net": recommended_total_net,
        "recommendedTotalNetRupees": recommended_total_net,
        "net_gain_vs_local": net_gain_vs_local,
        "netGainVsLocalRupees": net_gain_vs_local,
        "recommendation": summary_en,
        "summaryRecommendationEn": summary_en,
        "recommendation_kn": summary_kn,
        "summaryRecommendationKn": summary_kn,
        "recommendation_hi": summary_hi,
        "summaryRecommendationHi": summary_hi,
        "split": split,
        "per_mandi_breakdown": per_mandi_breakdown,
        "allMandisComparison": per_mandi_breakdown,
        "assumptions": [
            f"Diesel baseline: ₹{diesel_price}/L, freight rate: ₹18.0/km",
            f"Crop perishable stress: 48h shelf life (est. ~2.2% transit shrinkage)",
            f"APMC commission: 1.5% - 2.0%",
            "Seeded baseline calibrated for Ramesh (Kolar, Karnataka tomato farmer)",
        ],
        "data_freshness_minutes": data_freshness_minutes,
        "dataFreshnessMinutesAgo": data_freshness_minutes,
        "is_data_stale": is_stale,
        "isDataStale": is_stale,
        "verified_by_engine": True,
        "verifiedByEngine": True,
        "engineMode": "pure_python_or_ts",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
