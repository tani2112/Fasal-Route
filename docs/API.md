# FasalRoute Backend API Specification

> Base URL: `http://localhost:8000/api`  
> OpenAPI 3.1 Spec for FastAPI Backend  
> Auth: Internal Session or Bearer Token (Sarvam API Keys are never client-facing)

---

## 1. Voice & Decision Endpoints

### `POST /api/voice/decision`
Accepts farmer voice recording (WAV/MP3/WebM) or text query, executes the Sarvam AI pipeline, and returns the structured decision JSON along with audio stream URL.

#### Request (Multipart Form Data):
- `audio_file`: Optional binary audio stream
- `query_text`: Optional fallback string (e.g. `"2 tonnes of tomatoes in Kolar, what should I do?"`)
- `language`: Preferred Indic language code (`"kn"`, `"hi"`, `"mr"`, `"ta"`, `"en"`)
- `farmer_location`: Defaults to `"kolar"`

#### Response (`200 OK`):
```json
{
  "transcript": "2 tonnes of tomatoes in Kolar, what should I do?",
  "detected_language": "kn-IN",
  "intent": "sell_advice",
  "entities": {
    "crop": "tomato",
    "quantity_kg": 2000,
    "location": "Kolar"
  },
  "decision": {
    "crop": "tomato",
    "crop_name": "Tomato",
    "total_quantity_kg": 2000,
    "baseline_local_net_rupees": 36442,
    "recommended_total_net_rupees": 40642,
    "net_gain_vs_local_rupees": 4200,
    "split": [
      {
        "mandi_id": "kolar",
        "mandi_name": "Kolar APMC (Local)",
        "percentage": 40,
        "allocated_kg": 800,
        "rate_per_quintal": 1850,
        "net_in_hand_rupees": 14577,
        "is_local": true
      },
      {
        "mandi_id": "bengaluru_kr",
        "mandi_name": "Bengaluru KR Market",
        "percentage": 60,
        "allocated_kg": 1200,
        "rate_per_quintal": 2350,
        "transport_cost_rupees": 1170,
        "shrinkage_kg": 26.4,
        "shrinkage_rupees": 620,
        "net_in_hand_rupees": 26065,
        "is_local": false
      }
    ],
    "summary_spoken_text": "ಇಂದು ೪೦% ಸ್ಥಳೀಯ ಕೋಲಾರದಲ್ಲಿ ಮಾರಿ. ಉಳಿದ ೬೦% ಅನ್ನು ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆಗೆ ಕಳುಹಿಸಿ, ಇದರಿಂದ ನಿಮಗೆ +₹4,200 ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ.",
    "is_stale": false,
    "verified_by_engine": true
  },
  "audio_playback_url": "/api/voice/audio/stream_8819.mp3",
  "telemetry": {
    "total_latency_ms": 1185,
    "models": {
      "stt": { "name": "Saaras v4", "latency_ms": 242 },
      "nlu": { "name": "Sarvam-105B", "latency_ms": 384 },
      "engine": { "name": "FasalRoute Core", "latency_ms": 16 },
      "tts": { "name": "Bulbul", "latency_ms": 248 }
    }
  }
}
```

---

## 2. Decision Engine Endpoints

### `POST /api/engine/optimize`
Pure mathematical optimization without calling LLMs.

#### Request Body:
```json
{
  "crop_id": "tomato",
  "quantity_kg": 2000,
  "local_mandi_id": "kolar",
  "pool_discount_fraction": 0.0
}
```

#### Response (`200 OK`):
Returns the complete mathematical split, 5-mandi comparison, transit shrinkage deductions, and assumptions.

---

## 3. Mandi Intelligence Endpoints

### `GET /api/mandis/rates`
Fetches current Agmarknet / e-NAM modal prices, arrivals, and freshness for all 5 corridor mandis.

#### Query Parameters:
- `crop`: `"tomato"` | `"onion"` | `"potato"`
- `radius_km`: default `75`

---

## 4. Group Pooling & FPO Endpoints

### `GET /api/groups/pools`
Lists active FPO truck pools open for farmer aggregation.

### `POST /api/groups/pools/{pool_id}/join`
Allows a farmer to commit harvest weight to a shared mini-truck.
```json
{
  "farmer_name": "Ramesh Gowda",
  "crop": "tomato",
  "offered_kg": 800,
  "phone": "+9198XXXXXXXX"
}
```

---

## 5. Alerts Endpoints

### `POST /api/alerts/voice-create`
Natural language creation of a threshold alert via Sarvam-105B entity parsing.

### `GET /api/alerts`
Returns active price alerts for the authenticated farmer.
