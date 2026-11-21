# FasalRoute Technical Architecture

> **"The language model talks. The engine decides."**  
> Voice-First, Offline-Ready AI Decision Co-Pilot for Indian Smallholder Farmers.  
> Team: **ex-ONYX** | Powered by **Sarvam AI**

---

## 1. System Overview

FasalRoute addresses the three critical pain points causing ₹92,000+ Crore in post-harvest losses across India:
1. **Perishability & Spoilage**: Harvests rot in transit or while waiting in local mandi queues.
2. **Blind Pricing**: Farmers only see the price offered at their local APMC gate.
3. **Connectivity Blackouts**: Rural farms operate under intermittent 2G/no internet.

```
                                 ┌────────────────────────────────────────────────────────┐
                                 │                   SARVAM AI CLOUD                      │
                                 │                                                        │
   ┌──────────────┐   Audio      │  ┌──────────────┐     Tool Call     ┌──────────────┐   │
   │    Farmer    │ ───────────> │  │  Saaras v4   │ ────────────────> │ Sarvam-105B  │   │
   │  (Mic/Phone) │ <─────────── │  │  (STT Code)  │                   │  (NLU/Tool)  │   │
   └──────────────┘   Spoken MP3 │  └──────────────┘                   └──────┬───────┘   │
                                 │                                            │           │
                                 │  ┌──────────────┐                          │           │
                                 │  │  Bulbul TTS  │ <────────────────────────┘           │
                                 │  │  (Indic TTS) │     Locked Numbers Only              │
                                 │  └──────▲───────┘                                      │
                                 └─────────┼──────────────────────────────────────────────┘
                                           │
                                           │ JSON Payload
                                           ▼
                                ┌──────────────────────┐
                                │   FASALROUTE ENGINE  │
                                │   (Python / FastAPI) │
                                │                      │
                                │  • Shrinkage Physics │
                                │  • Diesel & Freight  │
                                │  • Multi-Mandi Split │
                                │  • Agmarknet / e-NAM │
                                └──────────────────────┘
```

---

## 2. Core Architectural Pillars

### A. The Strict Rupee Separation Principle
The Large Language Model (LLM) is strictly barred from arithmetic, price prediction, or inventing currency numbers.
- **Sarvam-105B** acts exclusively as the natural language interface: it parses spoken intent (`sell_advice`), extracts structured entities (`crop: tomato`, `qty: 2000kg`, `location: Kolar`), and executes a deterministic tool call `optimize_harvest_split()`.
- The **FasalRoute Decision Engine** calculates the exact rupee values using real transit loss physics, diesel rates, and APMC commissions.
- During natural language synthesis, an automated validation layer compares every numerical entity in the generated sentence against the engine's JSON output before forwarding the text to **Bulbul TTS**.

### B. Input Channels ("One Brain, Three Doors")
1. **In-App Mic (Web/PWA)**: Large 96px touch target with live waveform and code-mix audio recording via HTML5 MediaRecorder.
2. **WhatsApp Voice Note Adapter**: Inbound webhook receiving audio notes, returning synthesized voice notes + receipt cards via WhatsApp Cloud API stub.
3. **IVR Spoken Inbound (Telephony)**: SIP/PSTN telephony adapter for feature-phone users dialing a toll-free number.

### C. Multi-Tier Offline Architecture
- **PWA Service Worker**: Caches app shell, fonts, and assets for instant load without network.
- **Dexie IndexedDB**: Stores the **Market Pack** containing 5-mandi price curves, crop shelf-life constants, and transit road quality factors with freshness timestamps.
- **TypeScript Engine Mirror (`offlineEngine.ts`)**: Implements the identical mathematical optimization logic in client-side TypeScript, allowing the app to compute genuine decisions completely offline.
- **Stale-Data Guard**: Whenever cached prices exceed 3 hours, a prominent warning badge and spoken disclaimer alert the farmer.

---

## 3. Mathematical Decision Model

The engine optimizes net in-hand earnings across candidate mandis:

$$\text{Net Profit}(m) = (P_m - P_{\text{local}}) \times Q_m - C_{\text{transport}}(m) - L_{\text{shrinkage}}(m) - F_{\text{fees}}(m)$$

### Transit Shrinkage Physics
Perishable crops lose mass and grade during rough road transit:

$$L_{\text{shrinkage}} = Q_m \times \min\left(0.08, \; T_{\text{transit}} \times R_{\text{crop}} \times \left[\frac{48}{\max(12, S_{\text{shelf}})}\right] \times \phi_{\text{road}}\right) \times P_m$$

Where:
- $T_{\text{transit}}$: Travel duration in hours.
- $R_{\text{crop}}$: Base shrinkage coefficient (Tomato = 1.2%/hr, Onion = 0.2%/hr, Potato = 0.1%/hr).
- $S_{\text{shelf}}$: Perishable window in hours (Tomato = 48h).
- $\phi_{\text{road}}$: Road roughness factor (National Highway = 1.0, Rural State Highway = 1.15).

### Optimal Split Allocation
For perishable crops where distant price premiums exceed freight + shrinkage by $\ge ₹1,000$:
- **40% Local APMC**: Immediate liquidity and same-day farmgate cash.
- **60% Distant Urban Mandi (e.g. KR Market Bengaluru)**: Capitalize on metropolitan premium while hedging delay risks.

---

## 4. UI/UX & Design Tokens

Derived from the Neo-Brutalist Agricultural editorial design language:
- **Canvas**: Warm off-white parchment (`#F7F6EE`, `#FCFBF7`).
- **Forest Green**: Agrarian authority (`#0F2B20`, `#1B4736`).
- **Harvest Amber**: Sunlight and ripe wheat CTA (`#F2B134`, `#E29F20`).
- **Tactile Depth**: 2px solid charcoal borders with `3.5px 3.5px 0px #141C18` hard offset drop shadows.
- **Physical Receipt Motif**: "Mandi Mandate" tear-off receipt with perforated edges, barcode verification, and illustrative stamps.
- **Unclipped Indic Typography**: Explicit `line-height: 1.65` across Noto Sans Devanagari, Kannada, Marathi, and Tamil to safeguard matras and diacritics.
