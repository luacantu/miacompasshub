<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1466c577-ef71-4482-87fc-485ccce9fbd3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# 🧭 MIACompass Hub
### Miami's AI-Powered Community Resource Navigator

> "In 2012 I was a DV survivor, evicted with my daughter 
> and no resources. 15 years later I built this so no one 
> in Miami has to go through that alone."
> — Luana Cantu, Founder

---

## 🌐 Live App
**[miacompass.com]**

---

## 💡 What It Does

MIACompass Hub connects Miami-Dade residents with free 
housing, food, healthcare, jobs, education, and transit 
support — in English and Spanish, powered by AI.

Most people don't know what resources exist. And even 
when they do, the stress of daily survival makes it 
impossible to find them. MIACompass Hub bridges that gap.

---

## 🤖 How It Works

A 5-step survey collects the user's situation. Then 
4 specialized AI agents work together to find and 
deliver a personalized resource plan:

User Survey
     ↓
📋 Intake Agent
   Understands situation, detects language,
   determines resource tier (Federal/Florida/Miami-Dade)
     ↓
🔍 Research Agent  
   Searches real programs using Gemini grounding
   + verified Miami-Dade program directory
     ↓
✅ Eligibility Agent
   Filters by what the user actually qualifies for
   Ranks by urgency → impact → ease
     ↓
📄 Action Plan Agent
   Writes personalized plan with exact steps,
   phone numbers, documents needed, addresses
     ↓
💼 Jobs Agent
   Searches live Miami-Dade job listings
   matched to user profile
```

---

## 🏛️ Resource Tiers

Every plan is organized across 3 government levels:

| Tier | Programs |
|------|----------|
| 🇺🇸 Federal | SNAP, Medicaid, HUD, VA, SSDI, WIC |
| 🌴 Florida | DCF, KidCare, Bright Futures, CareerSource FL |
| 🏙️ Miami-Dade | ERAP, Jackson Health, Daily Bread, MDC, MDT |
| 📍 Neighborhood | Hialeah, Little Havana, Little Haiti, Homestead + more |

---

## ✨ Features

- **5-step onboarding survey** — employment, housing, 
  health, needs, location, urgency
- **Personalized resource plan** — 3-tier structure, 
  real programs, real phone numbers
- **Live job listings** — Miami-Dade jobs matched 
  to user profile
- **Transit Hub** — Google Maps trip planner to 
  any resource location
- **Ask Compass** — follow-up chat that remembers 
  your full profile
- **EduGrants Hub** — Florida, Miami-Dade & Broward 
  grants, scholarships, FAFSA support, college options
- **My Plan** — save programs, jobs, action steps
- **Fully bilingual** — English & Spanish, 
  auto-detected from survey
- **Urgency detection** — crisis resources surface first
- **Mobile responsive** — works on any device

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agents | Google ADK (Agent Development Kit) |
| AI Model | Gemini 2.5 Flash |
| Web Search | Gemini Grounding + Google Search Tool |
| Backend | Python + Flask |
| Frontend | Vanilla JS + HTML/CSS |
| Auth | Firebase Authentication |
| Persistence | localStorage + Firebase Firestore |
| Deployment | Google Cloud Platform |

---

## 🚀 Run Locally

**Prerequisites:** Python 3.11+, Node.js

**1. Clone the repo**
```bash
git clone https://github.com/luacantu/miacompasshub.git
cd miacompasshub
```

**2. Install dependencies**
```bash
pip install google-adk flask flask-cors
```

**3. Set your API key**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_key_here" > .env
```
Get a free key at: https://aistudio.google.com/apikey

**4. Run**
```bash
python main.py
```

**5. Open**
```
http://localhost:5000
```

---

## 🏆 Built At

**DeepStation Google Hackathon 2026**
Hosted by DeepStation, Miami Dade College & The LAB Miami
March 20-21, 2026 · Miami, Florida

**Hackathon Theme:** Use AI to make your community 
work better for the people in it.

**Stack used:** Google ADK · Gemini API · Google AI Studio

**Judge criteria met:**
- ✅ AI that takes action — not just answers
- ✅ Uses real data and live web grounding
- ✅ Solves a real problem end to end
- ✅ Multi-agent system (advanced tier)
- ✅ Community theme — Miami-Dade residents

---

## 🌎 The Story

MIACompass Hub was born from personal experience.

In 2012, the founder was a domestic violence survivor 
who was evicted and left with her daughter and nothing. 
Resources existed — housing help, food assistance, 
legal aid — but the stress of survival, language 
barriers, and scattered information made them 
impossible to find.

15 years later, as a developer and builder in Miami's 
tech community, she built MIACompass Hub at a hackathon 
because no one in her community should ever have to 
search alone.

---

## 📞 Emergency Resources

| | |
|---|---|
| 🚨 Emergency | 911 |
| 📞 Crisis & Resources | 211 |
| 🧠 Mental Health | 988 |
| 💜 Domestic Violence | 1-800-500-1119 |

---

## 👩‍💻 Built By

**Luana Cantuarias**
Founder · Developer · Miami

- 🌐 [miacompass.com](https://miacompass.com)
- 🐙 [github.com/luacantu](https://github.com/luacantu)

---

*MIACompass Hub — Miami has resources for you. 
Let's find them together.* 🧭

