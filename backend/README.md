
---

# Backend Directory (`backend`)

This directory contains the Node.js/Express backend for the Competitive Intelligence AI. It serves as the central hub of the application—handling REST API requests from the React frontend, securely connecting to the MongoDB database, and acting as the vital bridge to the Python Machine Learning engine.

## Table of Contents

1. [Environment Setup](https://www.google.com/search?q=%23environment-setup)
2. [Execution & Scripts](https://www.google.com/search?q=%23execution--scripts)
3. [Folder Structure & Architecture](https://www.google.com/search?q=%23folder-structure--architecture)

---

## Environment Setup

Before running the backend, you must configure your environment variables.

1. Locate the `.env.example` file in the root of the `backend` directory.
2. Create a new file named `.env` in the same location.
3. Copy the contents of `.env.example` into `.env` and fill in your specific credentials (e.g., MongoDB URI, JWT Secret, Port configuration).

---

## Execution & Scripts

The backend is built with TypeScript and Node.js. Use the following npm scripts to install dependencies and run the server.

### 1. Install Dependencies

Run this command first to install all required packages listed in your `package.json`.

```bash
npm install

```

### 2. Run in Development Mode

This command starts the server using a tool like `nodemon` or `ts-node-dev`. It will automatically watch for file changes and restart the server, making it ideal for active development.

```bash
npm run dev

```

### 3. Build for Production

This command compiles your TypeScript code (`.ts`) into standard JavaScript (`.js`) inside a `dist` or `build` folder. You must run this command before deploying the application or if you make changes to the ML integration types.

```bash
npm run build

```

---

## Folder Structure & Architecture

The backend follows a strict, modular Model-View-Controller (MVC) style architecture tailored for REST APIs. Here is a breakdown of what every folder and file does:

### 📂 `src/`

The main source code directory containing all TypeScript logic.

* **`server.ts`**: The entry point of the application. It initializes the Express app, applies global middleware (like CORS and JSON parsing), mounts the API routes, and starts the server listening on your designated port.

#### 📂 `src/config/`

* **`db.ts`**: Handles the connection logic to your MongoDB database using Mongoose.

#### 📂 `src/controllers/`

The "brain" of your API endpoints. These files handle incoming HTTP requests, process the logic, and send back the HTTP responses.

* **`authController.ts`**: Manages user registration, login, and token generation.
* **`metricsController.ts`**: Fetches and formats system performance data (like ROC and accuracy) for the Research Tab.
* **`predictController.ts`**: Receives draft data from the frontend, validates it, and passes it to the Python service.
* **`recommendController.ts`**: Handles logic for the AI Draft Recommendation game.
* **`spellController.ts`**: Manages the fetching of Summoner Spell data.
* **`tierListController.ts`**: Serves the dynamic champion meta rankings.

#### 📂 `src/middleware/`

Functions that run *before* a request reaches the controller.

* **`authMiddleware.ts`**: Verifies JSON Web Tokens (JWT) to ensure users are logged in before accessing protected routes like their Combat Logs.
* **`errorMiddleware.ts`**: A global error handler that catches server crashes and returns clean, formatted error messages to the frontend.

#### 📂 `src/models/`

Defines the Mongoose Schemas (the structure of your MongoDB database documents).

* **`Prediction.ts`**: The schema for saving user match predictions, including the drafted champions, selected spells, resulting win probability, and SHAP X-Ray explanations.
* **`Recommendation.ts`**: The schema for logging data from the draft recommendation game.
* **`User.ts`**: The schema for user accounts, passwords, and profile data.

#### 📂 `src/routes/`

Maps URL endpoints (e.g., `/api/predict`) to their specific functions in the `controllers` folder.

* **`authRoutes.ts`**: Routes for `/login` and `/register`.
* **`predictRoutes.ts`**: Routes for submitting a match prediction.
* **`recommendRoutes.ts`**: Routes for requesting draft advice.

#### 📂 `src/services/`

Contains external service integrations, separating complex tasks from the standard controller logic.

* **`pythonService.ts`**: **[CRITICAL SYSTEM]** This file uses Node's `child_process` to spawn Python shells. It securely passes the frontend's JSON draft data directly into the `ml/src/predict.py` or `ml/src/recommend.py` scripts via standard input (`stdin`), waits for the Machine Learning engine to calculate the result, and returns the output back to the controller.

#### 📂 `src/types/`

Contains TypeScript interface definitions to ensure strict typing across the application (e.g., defining exactly what a `PredictionRequest` object should look like).

#### 📂 `src/utils/`

Contains small, reusable helper functions (like custom loggers, date formatters, or math helpers) used throughout the backend.

### Root Files

* **`.env`**: Your active environment variables (ignored by Git for security).
* **`.env.example`**: A safe template showing what variables the system requires to run.