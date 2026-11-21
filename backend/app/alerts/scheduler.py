"""
APScheduler Price-Alert Background Polling Service.
Monitors price fluctuations against farmer thresholds.
"""

import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ..data.mandis import SEEDED_MARKET_RATES

logger = logging.getLogger("fasalroute.alerts")

ACTIVE_ALERTS = [
    {
        "id": "alert_1",
        "crop": "tomato",
        "target_mandi": "bengaluru_kr",
        "threshold_price": 2200.0,
        "condition": "above",
        "channel": "whatsapp",
        "phone": "+919876543210",
        "is_active": True,
        "last_triggered": "Triggered 2 hrs ago",
    },
    {
        "id": "alert_2",
        "crop": "onion",
        "target_mandi": "hosakote",
        "threshold_price": 2700.0,
        "condition": "above",
        "channel": "sms",
        "phone": "+919876543210",
        "is_active": True,
        "last_triggered": None,
    },
]

async def check_price_alerts():
    """
    Periodic job: compares current mandi prices against registered farmer thresholds.
    """
    logger.info("Executing periodic price alert check...")
    for alert in ACTIVE_ALERTS:
        if not alert["is_active"]:
            continue

        crop = alert["crop"]
        mandi = alert["target_mandi"]
        threshold = alert["threshold_price"]

        current_price = SEEDED_MARKET_RATES.get(crop, {}).get(mandi, 0.0)

        if alert["condition"] == "above" and current_price >= threshold:
            logger.info(
                f"[TRIGGERED] Alert {alert['id']}: {crop} in {mandi} reached ₹{current_price}/qtl "
                f"(threshold: ₹{threshold}). Dispatching message via {alert['channel']}."
            )
        elif alert["condition"] == "below" and current_price <= threshold:
            logger.info(
                f"[TRIGGERED] Alert {alert['id']}: {crop} in {mandi} dropped to ₹{current_price}/qtl. "
                f"Dispatching message via {alert['channel']}."
            )

scheduler = AsyncIOScheduler()
scheduler.add_job(check_price_alerts, "interval", minutes=15, id="price_alert_poll")
