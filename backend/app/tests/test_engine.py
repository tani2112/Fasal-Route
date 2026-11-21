"""
Comprehensive pytest suite for FasalRoute Decision Engine.
Verifies the Ramesh scenario, edge cases, shrinkage physics, and group pooling.
"""

import pytest
from app.engine.optimizer import optimize_harvest_split
from app.engine.shrinkage import calculate_shrinkage
from app.engine.transport import calculate_transport_cost
from app.engine.profit import calculate_mandi_net_profit

@pytest.fixture
def ramesh_tomato_scenario():
    """
    Illustrative seeded fixture for Ramesh (Kolar, Karnataka tomato farmer).
    2 tonnes (2000 kg) tomatoes, local APMC ₹1,850/qtl, KR Market ₹2,350/qtl.
    """
    return {
        "crop_id": "tomato",
        "quantity_kg": 2000.0,
        "local_mandi_id": "kolar",
        "custom_rates": {
            "kolar": 1850.0,
            "bengaluru_kr": 2350.0,
            "hosakote": 2050.0,
            "chintamani": 1820.0,
            "malur": 1920.0,
        },
    }

def test_ramesh_demo_scenario_reproducible(ramesh_tomato_scenario):
    """
    Validates that Ramesh earns approximately +₹4,200 net gain
    with a 40/60 split (40% Kolar, 60% Bengaluru KR Market).
    """
    res = optimize_harvest_split(
        crop_id=ramesh_tomato_scenario["crop_id"],
        quantity_kg=ramesh_tomato_scenario["quantity_kg"],
        local_mandi_id=ramesh_tomato_scenario["local_mandi_id"],
        custom_mandi_rates=ramesh_tomato_scenario["custom_rates"],
    )

    assert res["verified_by_engine"] is True
    assert len(res["split"]) == 2
    assert res["split"][0]["percentage"] == 40
    assert res["split"][1]["percentage"] == 60

    # Net gain should be within calibrated range (~+₹4,200)
    assert 3800.0 <= res["net_gain_vs_local"] <= 4500.0
    assert "₹4," in res["recommendation"]
    assert "ಕೋಲಾರ" in res["recommendation_kn"]
    assert "बेंगलुरु" in res["recommendation_hi"]

def test_edge_case_zero_quantity():
    """Validates that zero or negative quantity raises ValueError."""
    with pytest.raises(ValueError, match="strictly greater than zero"):
        optimize_harvest_split(crop_id="tomato", quantity_kg=0.0)

    with pytest.raises(ValueError, match="strictly greater than zero"):
        optimize_harvest_split(crop_id="tomato", quantity_kg=-500.0)

def test_edge_case_all_mandis_worse_than_local():
    """
    When all distant mandis have prices equal to or worse than local,
    engine must recommend 100% local selling with ₹0 net gain.
    """
    depressed_rates = {
        "kolar": 2000.0,
        "bengaluru_kr": 1900.0, # worse
        "hosakote": 1850.0,    # worse
        "chintamani": 1700.0,  # worse
        "malur": 1800.0,       # worse
    }
    res = optimize_harvest_split(
        crop_id="tomato",
        quantity_kg=1500.0,
        local_mandi_id="kolar",
        custom_mandi_rates=depressed_rates,
    )

    assert len(res["split"]) == 1
    assert res["split"][0]["is_local"] is True
    assert res["split"][0]["percentage"] == 100
    assert res["net_gain_vs_local"] == 0.0
    assert "Sell 100%" in res["recommendation"]

def test_edge_case_unknown_crop():
    """
    When an unrecognized crop is passed, engine safely defaults to standard vegetable profile.
    """
    res = optimize_harvest_split(
        crop_id="dragonfruit_unknown",
        quantity_kg=1000.0,
    )
    assert res["verified_by_engine"] is True
    assert res["recommended_total_net"] > 0

def test_edge_case_stale_prices():
    """Validates stale data flag when freshness exceeds 180 minutes."""
    res = optimize_harvest_split(
        crop_id="tomato",
        quantity_kg=2000.0,
        data_freshness_minutes=240, # 4 hours old
    )
    assert res["is_data_stale"] is True

    fresh_res = optimize_harvest_split(
        crop_id="tomato",
        quantity_kg=2000.0,
        data_freshness_minutes=15, # 15 mins old
    )
    assert fresh_res["is_data_stale"] is False

def test_group_selling_pooling_freight_reduction():
    """
    Tests that a 75% pool discount (4 farmers sharing a truck)
    lowers transport costs and increases farmer's net return.
    """
    solo = optimize_harvest_split(
        crop_id="tomato",
        quantity_kg=2000.0,
        pool_discount_fraction=0.0,
    )

    pooled = optimize_harvest_split(
        crop_id="tomato",
        quantity_kg=2000.0,
        pool_discount_fraction=0.75, # 4 farmers share truck
    )

    # Distant transport cost in pool should be significantly lower
    solo_transport = solo["split"][1]["transport_cost_rupees"]
    pooled_transport = pooled["split"][1]["transport_cost_rupees"]
    assert pooled_transport < solo_transport
    assert pooled["recommended_total_net"] > solo["recommended_total_net"]

def test_shrinkage_physics_increases_with_distance():
    """
    Verifies that longer transit times produce proportionally higher shrinkage loss.
    """
    short_trip = calculate_shrinkage(
        crop_id="tomato",
        travel_time_hours=0.5,
        quantity_kg=1000.0,
        price_per_kg=20.0,
    )
    long_trip = calculate_shrinkage(
        crop_id="tomato",
        travel_time_hours=3.5,
        quantity_kg=1000.0,
        price_per_kg=20.0,
    )

    assert long_trip["shrinkage_kg"] > short_trip["shrinkage_kg"]
    assert long_trip["shrinkage_rupees"] > short_trip["shrinkage_rupees"]
