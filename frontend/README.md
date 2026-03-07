
---

# Frontend Directory (`frontend`)

This directory contains the user-facing web application for the Competitive Intelligence AI. Built with **Next.js**, **React**, **Tailwind CSS**, and **Framer Motion**, it provides a fluid, cyberpunk-themed interface where users can draft teams, view the SHAP X-Ray Dashboard, play the Recommendation Game, and analyze academic research metrics.

## Table of Contents

1. [Environment Setup](https://www.google.com/search?q=%23environment-setup)
2. [Execution & Scripts](https://www.google.com/search?q=%23execution--scripts)
3. [Folder Structure & Architecture](https://www.google.com/search?q=%23folder-structure--architecture)

---

## Environment Setup

To allow the frontend to communicate with your Node.js backend, you must configure your environment variables.

1. Create a new file named `.env.local` in the root of the `frontend` directory.
2. Define your backend API URL inside this file. For local development, it typically looks like this:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```



*(Note: Using the `NEXT_PUBLIC_` prefix is required in Next.js to expose this variable to the browser).*

---

## Execution & Scripts

Use the following npm scripts to install dependencies, run the development server, and build the project for production.

### 1. Install Dependencies

Run this command first to install all required packages (React, Framer Motion, Recharts, Lucide, etc.) listed in your `package.json`.

```bash
npm install

```

### 2. Run in Development Mode

This command starts the Next.js development server. It includes Hot Module Replacement (HMR), meaning any changes you make to the code will instantly update in the browser.

```bash
npm run dev

```

*Access the application by opening `http://localhost:3000` in your web browser.*

### 3. Build for Production

This compiles your React components and Next.js routes into highly optimized, static HTML/CSS and minified JavaScript bundles. You must run this command before deploying the frontend to a service like Vercel or Netlify.

```bash
npm run build

```

### 4. Start Production Server

After running the build command, use this script to serve the optimized production version of your app locally to test its final performance.

```bash
npm start

```

---

## Folder Structure & Architecture

This frontend utilizes the modern Next.js **App Router** architecture. Here is a breakdown of what every folder and file does:

### 📂 `src/app/`

This is the routing core of the application. Every folder inside `app/` represents a URL route, and the `page.jsx` inside it is the UI for that route.

* **`layout.jsx`**: The global layout wrapper. It contains the HTML shell, global fonts, and metadata for SEO.
* **`page.jsx`**: The main Landing Page (Home) of the website.
* **📂 `predict/page.jsx**`: The core Match Predictor interface where users draft 10 champions and spells.
* **📂 `history/page.jsx**`: The Combat Logs interface that fetches and displays past predictions from the database.
* **📂 `recommend/page.jsx**`: The interactive AI Draft Pick Recommendation game.
* **📂 `tierlist/page.jsx**`: The dynamic Champion Tier List and hero dashboard.
* **📂 `research/page.jsx**`: The academic analytics dashboard displaying ROC curves and ML accuracy metrics.

### 📂 `src/components/`

Contains all the reusable, modular React components. Keeping these separate from the `app/` directory keeps the routing clean.

* **`Navbar.jsx`**: The global top navigation bar.
* **`GlassCard.jsx`**: The stylized, translucent container used for UI elements.
* **`ChampionPicker.jsx`**: The interactive grid and search bar for selecting heroes.
* **`WinProbability.jsx`**: The animated gauge chart displaying the final AI prediction percentage.
* **`XRayDashboard.jsx`**: Uses **Recharts** to render the SHAP values into readable horizontal bar charts.
* **`PredictionResult.jsx`**: Displays tactical warnings (like missing Smite) and draft summaries.

### 📂 `src/lib/`

Contains utility libraries and configuration files used across the frontend.

* **`api.js`**: An Axios instance pre-configured with your `NEXT_PUBLIC_API_URL`. It handles all HTTP requests (GET, POST) to your Node.js backend and attaches JWT tokens for authenticated routes.

### 📂 `public/`

Stores static assets that do not need to be processed by Webpack.

* Contains local images, icons, and the `favicon.ico`.

### Root Files

* **`tailwind.config.js`**: The configuration file for Tailwind CSS. It holds your custom cyberpunk color palette (e.g., `#00f2ff`, `#ef4444`) and custom animations.
* **`postcss.config.js`**: The CSS processor configuration required by Tailwind.
* **`package.json`**: Lists all project dependencies and executable scripts.
* **`.gitignore`**: Specifies folders like `node_modules` and `.next` to be ignored by version control.