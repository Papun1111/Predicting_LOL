# ⚙️ API Gateway & Orchestration Layer (`backend`)

The `backend` serves as the central nervous system of the project. Built with **Node.js**, **Express**, and **TypeScript**, it orchestrates the flow of data between the interactive Next.js frontend, the persistent MongoDB database, and the Python-based Intelligence Engine.

## 🚀 Key Responsibilities
- **API Management**: Provides secure RESTful endpoints for drafting, history, and analytics.
- **Python Orchestration**: Dynamically spawns Python processes to run ML inference via `pythonService.ts`.
- **Data Persistence**: Manages user accounts, combat logs, and champion metadata via **Mongoose**.
- **Security**: Implements JWT-based authentication for user-specific features.

---

## 🛠️ Setup & Execution

### 1. Configure Environment
Create a `.env` file from the template:
```bash
cp .env.example .env
```
*Fill in your `MONGODB_URI` and `JWT_SECRET`.*

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📂 System Architecture (MVC)

### `src/controllers/`
The logic handlers for API requests:
- `predictController.ts`: Validates drafts and triggers the ML prediction flow.
- `recommendController.ts`: Manages the AI Draft Recommendation "mini-game".
- `metricsController.ts`: Aggregates model performance data for the Research Tab.

### `src/services/` (The Integration Core)
- **`pythonService.ts`**: The most critical component. It handles the low-level communication with the `ml/src` scripts using `child_process`. It passes draft JSON via `stdin` and parses AI results from `stdout`.

### `src/models/`
Defines the structure of our intelligence database:
- `Prediction.ts`: Stores match drafts, SHAP X-Ray charts, and win probabilities.
- `Recommendation.ts`: Logs sessions from the AI drafting assistant.
- `User.ts`: Manages encrypted credentials and profiles.

### `src/middleware/`
- `authMiddleware.ts`: Ensures only logged-in users can save or view combat logs.
- `errorMiddleware.ts`: Standardized error responses across all API endpoints.

---

**Developed for high-performance AI orchestration and scalable game analytics.**
s the system requires to run.