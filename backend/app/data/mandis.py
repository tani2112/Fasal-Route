"""
Agmarknet & e-NAM corridor market data around Kolar Agro-Hub.
"""

from typing import Dict, Any, List

CANDIDATE_MANDIS: Dict[str, Dict[str, Any]] = {
    "kolar": {
        "id": "kolar",
        "name": "Kolar APMC (Local)",
        "name_kn": "ಕೋಲಾರ ಎಪಿಎಂಸಿ (ಸ್ಥಳೀಯ)",
        "name_hi": "कोलार एपीएमसी (स्थानीय)",
        "district": "Kolar",
        "state": "Karnataka",
        "distance_km": 0.0,
        "travel_time_hours": 0.0,
        "road_quality_factor": 1.0,
        "commission_rate": 0.015,
    },
    "bengaluru_kr": {
        "id": "bengaluru_kr",
        "name": "Bengaluru KR Market",
        "name_kn": "ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ",
        "name_hi": "बेंगलुरु के.आर. मार्केट",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "distance_km": 65.0,
        "travel_time_hours": 2.2,
        "road_quality_factor": 1.05,
        "commission_rate": 0.02,
    },
    "hosakote": {
        "id": "hosakote",
        "name": "Hosakote Mandi",
        "name_kn": "ಹೊಸಕೋಟೆ ಮಂಡಿ",
        "name_hi": "होसकोटे मंडी",
        "district": "Bengaluru Rural",
        "state": "Karnataka",
        "distance_km": 38.0,
        "travel_time_hours": 1.1,
        "road_quality_factor": 1.0,
        "commission_rate": 0.015,
    },
    "chintamani": {
        "id": "chintamani",
        "name": "Chintamani APMC",
        "name_kn": "ಚಿಂತಾಮಣಿ ಎಪಿಎಂಸಿ",
        "name_hi": "चिंतामणि एपीएमसी",
        "district": "Chikkaballapura",
        "state": "Karnataka",
        "distance_km": 42.0,
        "travel_time_hours": 1.3,
        "road_quality_factor": 1.15,
        "commission_rate": 0.015,
    },
    "malur": {
        "id": "malur",
        "name": "Malur Market Yard",
        "name_kn": "ಮಾಲೂರು ಮಾರುಕಟ್ಟೆ",
        "name_hi": "मालूर मंडी यार्ड",
        "district": "Kolar",
        "state": "Karnataka",
        "distance_km": 28.0,
        "travel_time_hours": 0.8,
        "road_quality_factor": 1.1,
        "commission_rate": 0.015,
    },
}

# Seeded Agmarknet rates
SEEDED_MARKET_RATES: Dict[str, Dict[str, float]] = {
    # Mandi ID -> price per quintal (₹)
    "tomato": {
        "kolar": 1850.0,
        "bengaluru_kr": 2350.0,
        "hosakote": 2050.0,
        "chintamani": 1820.0,
        "malur": 1920.0,
    },
    "onion": {
        "kolar": 2400.0,
        "bengaluru_kr": 2850.0,
        "hosakote": 2600.0,
        "chintamani": 2350.0,
        "malur": 2450.0,
    },
    "potato": {
        "kolar": 1600.0,
        "bengaluru_kr": 1980.0,
        "hosakote": 1750.0,
        "chintamani": 1580.0,
        "malur": 1650.0,
    },
}
