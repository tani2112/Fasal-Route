# FasalRoute — 2-Minute Hackathon Demo Script

> **Setting**: Hackathon Presentation / Video Demo  
> **Speaker**: Team ex-ONYX  
> **Target Audience**: Judges, Agricultural Economists, Engineers  
> **Time**: 120 Seconds (Strict)

---

### [00:00 - 00:25] The Problem & Hook
*(Hold phone showing the FasalRoute home screen with the warm neo-brutalist harvest aesthetic)*

"Meet Ramesh. Ramesh is a tomato farmer in Kolar, Karnataka. Yesterday he harvested 2 tonnes of Grade-A tomatoes.  
At his local Kolar mandi, the traders offer him ₹1,850 a quintal. 65 kilometers away in Bangalore, KR Market is paying ₹2,350.  
Should Ramesh hire a mini-truck and go to Bangalore?  
If he goes, he pays ₹2,400 for diesel. 2.5% of his tomatoes will bruise and rot on the highway. And what if the price crashes while he's driving?  
Right now, Ramesh has to guess in the dark. That blind guessing causes Indian farmers to lose over ₹92,000 Crore every single year.  
Until today."

---

### [00:25 - 00:55] The Voice Interaction (Sarvam AI in Action)
*(Tap the large golden mic button. The yellow waveform animates.)*

"With FasalRoute, Ramesh doesn't need to read or type complex apps. He just taps one button and speaks naturally in Kannada:  
*‘ಕೋಲಾರದಲ್ಲಿ 2 ಟನ್ ಟೊಮೇಟೊ ಇದೆ, ನಾನೇನು ಮಾಡಬೇಕು?’*  
*(2 tonnes of tomatoes in Kolar, what should I do?)*"

*(Release mic. The thinking spinner activates and the pipeline runs in 1.1 seconds.)*

"Notice what just happened behind the scenes:
1. **Saaras v4** transcribed Ramesh’s Kannada with code-mix numbers in 240 milliseconds.
2. **Sarvam-105B** classified his intent and invoked our Python decision engine tool.
3. **Crucial rule**: The LLM did not guess or invent a single rupee! Every figure was computed deterministically."

---

### [00:55 - 01:25] The Spoken Mandi Mandate & Receipt
*(Point to the tactile Mandi Mandate receipt on screen. Tap 'LISTEN' to play Bulbul voice.)*

*(Audio plays in crisp Kannada)*  
*‘ಇಂದು ೪೦% ಸ್ಥಳೀಯ ಕೋಲಾರದಲ್ಲಿ ಮಾರಿ. ಉಳಿದ ೬೦% ಅನ್ನು ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆಗೆ ಕಳುಹಿಸಿ, ಇದರಿಂದ ನಿಮಗೆ +₹4,200 ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ.’*

"Look at this physical receipt card:
- The engine calculated the optimal risk-hedged split: **Sell 40% (800 kg) locally** for immediate same-day liquidity.  
- **Send 60% (1,200 kg) to Bangalore KR Market**.
- After deducting ₹1,170 diesel, 26.4 kg transit shrinkage, and APMC commission, Ramesh takes home **+₹4,200 extra cash** in his pocket today!
- And every number is verified in code with an SHA-256 hash stamp."

---

### [01:25 - 01:45] Group Selling & True Offline Mode
*(Tap 'Group Selling' tab)*

"What if Ramesh doesn't have a full truckload?  
Under **Group Selling**, our FPO pooling module connects him with 3 neighbouring farmers. Instead of paying ₹2,400 alone, the freight drops to **₹600 each**—putting another ₹1,800 back into his family budget."

*(Flip the Dev 'Simulate Offline' toggle)*

"Now, look at the top banner. We just cut the internet completely.  
No 4G? No problem.  
FasalRoute's client-side engine runs directly against the **IndexedDB Market Pack**. Ramesh can speak his query, get calculated decisions offline, and view stale-price risk warnings until connection returns."

---

### [01:45 - 02:00] Business Model & Wrap-Up
*(Show Impact / Sarvam Telemetry page)*

"FasalRoute is **100% free for farmers forever**.  
We monetize through FPO SaaS dashboards, verified logistics lead fees, and cold-storage aggregation.  
We’re targeting **SDG 1 (No Poverty)**, **SDG 2 (Zero Hunger)**, and **SDG 12 (Responsible Consumption)**.

This is FasalRoute. Built with Sarvam AI by Team ex-ONYX.  
Thank you!"
