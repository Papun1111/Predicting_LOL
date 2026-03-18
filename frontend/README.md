# 💻 Cyberpunk Analytics Interface (`frontend`)

The `frontend` is a high-performance, interactive dashboard built with **Next.js 16+**, **Tailwind CSS 4**, and **Framer Motion**. It provides a premium "Cyberpunk" aesthetic for visualizing complex AI match predictions and champion analytics.

## ✨ Key Features
- **Dynamic Draft Picker**: Real-time selection of champions and summoner spells with instant AI feedback.
- **SHAP X-Ray Dashboard**: Visualizes model explainability using horizontal bar charts (`recharts`).
- **AI Recommendation Mini-game**: An interactive way to find the mathematically optimal next pick.
- **Academic Research Tab**: Visualizes ROC-AUC curves and model distribution graphs.
- **Persistent Combat Logs**: Review past predictions and learn from AI-driven insights.

---

## 🛠️ Setup & Execution

### 1. Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
*Access the UI at `http://localhost:3000`.*

---

## 📂 App Architecture (Next.js App Router)

### `src/app/` (Routes)
- `page.tsx`: The high-impact landing page.
- `predict/page.tsx`: The core match predictor and X-Ray dashboard.
- `recommend/page.tsx`: The draft optimization assistant.
- `history/page.tsx`: User-specific combat logs and saved drafts.
- `research/page.tsx`: Academic performance analytics.

### `src/components/` (UI Core)
- `XRayDashboard.tsx`: The primary interface for SHAP interpretability.
- `ChampionPicker.tsx`: Fast, searchable grid for drafting.
- `WinProbability.tsx`: Animated gauge showing the AI's confidence level.

### `src/lib/`
- `api.js`: Pre-configured Axios instance for backend communication.

---

**Designed for visual excellence and data-driven decision making in League of Legends.**
ignored by version control.