# FasalRoute (फसलरूट / ಫಸಲ್ ರೂಟ್)

> **Voice-First, Offline-Ready AI Decision Co-Pilot for Indian Smallholder Farmers.**  
> *"Speak to your harvest. Sell at the right place, at the right time."*  
> Built for the hackathon by **Team ex-ONYX** · Powered by **Sarvam AI**.

---

## 🌾 The Problem
Indian farmers lose over **₹92,000 Crore annually** due to three compounding barriers:
1. **Perishability & Spoilage**: Harvests rot in transit or while waiting in local mandi queues.
2. **Blind Pricing**: Farmers only see the price offered at their local APMC gate.
3. **No Internet**: Rural farmlands operate under intermittent 2G or complete network blackouts.

**FasalRoute** lets a farmer ask one simple question in their mother tongue—e.g., *"2 tonnes of tomatoes in Kolar, what should I do?"*—and receive an immediate spoken decision:  
> *"Sell 40% (800 kg) at Kolar APMC today for instant liquidity. Send 60% (1,200 kg) to Bangalore KR Market, 65 km away, for an extra +₹4,200 net in-hand profit after diesel, freight, and transit shrinkage."*

---

## 🎨 Design System: Neo-Brutalist Agriculture
Inspired by physical harvest mandi mandates and neo-brutalist tactile editorial design:
- **Warm Parchment Canvas**: `#F7F6EE` / `#FCFBF7`
- **Deep Agrarian Forest**: `#0F2B20` (high authority dark accents)
- **Ripe Wheat & Tomato Amber**: `#F2B134` (interactive CTAs and yellow highlighter marker motif)
- **Tactile Shadows & Borders**: Crisp 2px/3px solid charcoal borders with `3.5px 3.5px 0px #141C18` hard drop shadows
- **Physical "Mandi Mandate" Receipt**: Skewed paper receipt card with perforated teeth, red illustrative stamp, verification barcode, and spoken playback
- **Multi-Script Typography**: Built on Fraunces, DM Sans, and unclipped Indic fonts (Noto Sans Devanagari, Kannada, Tamil, Marathi) with custom line-height headroom to protect upper and lower matras/diacritics

---

## 🧠 Architectural Principle: "The Language Model Talks. The Engine Decides."
The LLM is strictly prohibited from computing or inventing rupee figures:
```
Farmer Speaks 
   │
   ▼
1. Saaras v4 (STT) ────────► Multilingual code-mix audio-to-text (~240ms)
   │
   ▼
2. Sarvam-105B (NLU) ──────► Intent classification & structured tool calling (~380ms)
   │
   ▼
3. FasalRoute Engine ──────► Pure deterministic Python/TS profit & shrinkage math (~16ms)
   │
   ▼
4. Sarvam-105B (Synthesis) ► Localized spoken advice with strictly verified numbers (~295ms)
   │
   ▼
5. Bulbul (TTS) ───────────► Native-cadence audio speech synthesis (~248ms)
```

---

## 📱 Launch Languages
1. **Kannada (ಕನ್ನಡ)** — Native tongue of the Kolar tomato hub
2. **Hindi (हिंदी)** — North/Central agricultural belt
3. **Marathi (मराठी)** — Onion & vegetable heartland
4. **Tamil (தமிழ்)** — Southern corridor
5. **English** — Fallback & developer inspection

---

## 🚀 Key Modules
1. **Voice Decision Engine**: 96px+ touch target with live yellow waveform, code-mix transcript, and physical Mandi Mandate receipt.
2. **5-Mandi Real-Time Compare**: Kolar APMC vs Bengaluru KR Market, Hosakote, Chintamani, and Malur.
3. **Voice Price Alerts**: "Say-it-once" creation with WhatsApp and IVR telephone adapters.
4. **Group Selling (FPO Pool)**: Share mini-trucks with neighbours (₹2,400 freight split across 4 farmers = ₹600 each, saving ₹1,800).
5. **Multi-Tier Offline PWA**: Service Worker caching, Dexie IndexedDB Market Pack, and client-side TypeScript engine mirror with stale-data warnings.
6. **Sarvam AI Inspector**: Interactive telemetry panel showing step-by-step latency, token diagnostics, and credit monitor.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Dexie (IndexedDB), react-i18next
- **Backend (Phase 2)**: Python FastAPI (async), SQLite (SQLAlchemy), APScheduler
- **AI Cloud**: Sarvam AI (Saaras v4, Sarvam-105B, Bulbul TTS, Translate)
- **Data**: Agmarknet / data.gov.in seeded agricultural datasets

---

## ⚡ Quick Start

### 1. Frontend (Mobile-First PWA)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- Set `USE_MOCKS=true` for local zero-credit demonstration.
- Set `USE_MOCKS=false` and provide `SARVAM_API_KEY` for live Sarvam AI endpoints.

---

## 📚 Documentation
- [Technical Architecture](docs/ARCHITECTURE.md)
- [Backend API Specification](docs/API.md)
- [2-Minute Hackathon Pitch Script](docs/DEMO_SCRIPT.md)

---

## 🌍 UN Sustainable Development Goals
- **SDG 1: No Poverty** — Unlocking +₹4,200 on every 2 tonnes through corridor arbitrage.
- **SDG 2: Zero Hunger** — Eliminating post-harvest transit spoilage with shelf-life curves.
- **SDG 12: Responsible Consumption** — Group pooling cuts agricultural transport carbon footprints.

**Farmers pay ₹0 forever.** Revenue from FPO subscriptions, verified logistics leads, and input partnerships.
