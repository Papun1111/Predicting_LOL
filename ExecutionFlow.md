# 🎯 Complete Execution Guide: League of Legends Hybrid AI Predictor

Follow these exact steps in order to set up, train, run, and scientifically validate the project.

---

## 🛠️ Prerequisites & Setup (Run Once)

Ensure you have **Python 3.8+** and **Node.js** installed on your machine.

### 1. Install Python Dependencies
Open your terminal, navigate to the `ml` folder, and run:
```bash
cd ml
pip install -r requirements.txt
```

### 2. Install Backend Dependencies
Open a new terminal, navigate to the `backend` folder, and run:
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
Open a new terminal, navigate to the `frontend` folder, and run:
```bash
cd frontend
npm install
```

---

## 🧪 Phase 1: The Data Pipeline & Model Training

This phase processes the raw data, calculates professional heuristics, and trains the Machine Learning Ensemble.  
**All commands must be run from inside the `ml` directory.**

### Step 1: Clean and Load the Raw Dataset
```bash
cd ml/src
python load_data.py
```

### Step 2: Generate Intelligence Matrices
Calculates synergy, matchups, and meta scores.
```bash
python generate_stats.py
```

### Step 3: Train the Hybrid Ensemble Model
Trains the XGBoost/Random Forest models and SHAP explainer.
> Using the `--tune` flag will run Optuna hyperparameter optimization before training. Step 3 will create your finalized `.pkl` "brain" files inside the `models` folder.

**Standard Training:**
```bash
python train.py
```

**Optimized Training:**
```bash
python train.py --tune
```

---

## 🌐 Phase 2: The Live Web Application Showcase

This phase launches the actual user interface where the AI makes real-time predictions.

### Step 1: Start the Backend Server
Open a terminal, navigate to the `backend` folder, and run:
```bash
cd backend
npm run dev
```

### Step 2: Start the Frontend Interface
Open a second terminal, navigate to the `frontend` folder, and run:
```bash
cd frontend
npm run dev
```

### Step 3: Test the Application
Open the provided `localhost` URL in your web browser. Draft a 5v5 team, select Summoner Spells, and click **"Predict"** to see the real-time Win Probability and X-Ray Dashboard.

---

## 📊 Phase 3: Academic Proof & Validation

This phase runs the automated Monte Carlo simulations to prove the system's mathematical accuracy at scale.  
**All commands must be run from inside the `ml/src` directory.**

### Step 1: Run the Monte Carlo Simulation
This simulates 1,000 unique 5v5 matches with random tactical errors and saves the results to `dynamic_monte_carlo_results.csv`.
```bash
cd ml/src
python dynamic_paper_test.py
```

### Step 2: Generate Academic Visualizations
This reads the CSV file and outputs three high-resolution academic graphs (Distribution, Boxplots, and SHAP factors) into the `results/plots/` folder.
```bash
python visualize_paper_results.py
```

---

## ⚠️ Important System Architecture Notes

Do **NOT** run the following files manually in the terminal. They are system modules designed to be triggered automatically by the Node.js backend:

- `src/predict.py`: Listens for UI data to make predictions
- `src/recommend.py`: Listens for UI data to recommend champions
- `src/config.py`: Stores environmental variables
- `src/feature_engineering.py`: Formats matrices during runtime