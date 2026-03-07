COMPLETE EXECUTION GUIDE: LEAGUE OF LEGENDS HYBRID AI PREDICTOR

Follow these exact steps in order to set up, train, run, and scientifically validate the project.

# ======================================================
PREREQUISITES & SETUP (Run Once)

Ensure you have Python 3.8+ and Node.js installed on your machine.

1. Install Python Dependencies:
Open your terminal, navigate to the "ml" folder, and run:
pip install -r requirements.txt
2. Install Backend Dependencies:
Open a new terminal, navigate to the "backend" folder, and run:
npm install
3. Install Frontend Dependencies:
Open a new terminal, navigate to the "frontend" folder, and run:
npm install

# ======================================================
PHASE 1: THE DATA PIPELINE & MODEL TRAINING

This phase processes the raw data, calculates professional heuristics, and trains the Machine Learning Ensemble. All commands must be run from inside the "ml" directory.

Step 1: Clean and load the raw dataset.
Command: python src/load_data.py

Step 2: Generate the intelligence matrices (synergy, matchups, and meta scores).
Command: python src/generate_stats.py

Step 3: Train the Hybrid Ensemble Model (XGBoost/Random Forest) and SHAP explainer.
Command (Standard): python src/train.py
Command (Optimized): python src/train.py --tune
*Note: Using the --tune flag will run Optuna hyperparameter optimization before training. Step 3 will create your finalized .pkl "brain" files inside the "models" folder.*

# ======================================================
PHASE 2: THE LIVE WEB APPLICATION SHOWCASE

This phase launches the actual user interface where the AI makes real-time predictions.

Step 1: Start the Backend Server
Open a terminal, navigate to the "backend" folder, and run:
npm run dev

Step 2: Start the Frontend Interface
Open a second terminal, navigate to the "frontend" folder, and run:
npm run dev

Step 3: Test the Application
Open the provided localhost URL in your web browser. Draft a 5v5 team, select Summoner Spells, and click "Predict" to see the real-time Win Probability and X-Ray Dashboard.

# ======================================================
PHASE 3: ACADEMIC PROOF & VALIDATION

This phase runs the automated Monte Carlo simulations to prove the system's mathematical accuracy at scale. All commands must be run from inside the "ml" directory.

Step 1: Run the Monte Carlo Simulation
Command: python src/dynamic_paper_test.py
*Details: This simulates 1,000 unique 5v5 matches with random tactical errors and saves the results to dynamic_monte_carlo_results.csv.*

Step 2: Generate Academic Visualizations
Command: python src/visualize_paper_results.py
*Details: This reads the CSV file and outputs three high-resolution academic graphs (Distribution, Boxplots, and SHAP factors) into the results/plots/ folder.*

# ======================================================
IMPORTANT SYSTEM ARCHITECTURE NOTES

Do NOT run the following files manually in the terminal. They are system modules designed to be triggered automatically by the Node.js backend:

* src/predict.py (Listens for UI data to make predictions)
* src/recommend.py (Listens for UI data to recommend champions)
* src/config.py (Stores environmental variables)
* src/feature_engineering.py (Formats matrices during runtime)