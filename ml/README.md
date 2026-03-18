# 🧠 Intelligence Engine & ML Pipeline (`ml`)

This directory houses the core "Brain" of the project—a **Hybrid Intelligent Architecture** that combines high-performance Machine Learning with expert-driven heuristics. It manages the entire lifecycle of the League of Legends predictor, from raw data ingestion to real-time inference and academic validation.

## 🛠️ Environment Setup

To ensure stability and isolate dependencies, it is mandatory to use a virtual environment.

### 1. Create a Virtual Environment
Navigate to the `ml` directory:
```bash
python -m venv venv
```

### 2. Activate the Environment
- **Windows**: `.\venv\Scripts\activate`
- **macOS / Linux**: `source venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ⚡ Execution Flow & Phases

The system is divided into three distinct operational phases:

### Phase 1: Data Pipeline & Intelligence Generation
Before training, the system must process raw data into "Intelligence Matrices" (Synergy, Matchups, Meta).

Navigate to the source directory:
```bash
cd src
```

1.  **Load Data**: `python load_data.py` (Cleans raw `games.csv`).
2.  **Generate Stats**: `python generate_stats.py` (Calculates the mathematical "Soul" of the AI).

### Phase 2: Training & Optimization
Trains the **Stacking Ensemble** (XGBoost + Random Forest) and the **SHAP Explainer**.
- **Standard**: `python train.py`
- **Optimized**: `python train.py --tune` (Uses **Optuna** for hyperparameter tuning).

### Phase 3: Inference & Real-Time Services
These scripts are called by the `backend` via `pythonService.ts`, but can be tested manually:
- **Predict**: `python predict.py` (Real-time win probability + SHAP X-Ray).
- **Recommend**: `python recommend.py` (Iterative draft optimization).

### Phase 4: Academic Validation
Produces results for paper publishing (Run from `src`):
1.  **Monte Carlo**: `python dynamic_paper_test.py` (1,000+ match simulations).
2.  **Visualize**: `python visualize_paper_results.py` (Generates plots in `results/`).

---

## 📂 Folder Structure

### `data/`
Raw datasets and processed metadata:
- `games.csv`: The historical match foundation.
- `champion_full_stats.json`: Metadata for all League heroes.
- `model_metrics.json`: Accuracy/ROC metrics saved after training.

### `models/` (The "Brain" Artifacts)
Serialized `.pkl` files loaded during runtime:
- `ensemble_model.pkl`: The core predictor.
- `explainer.pkl`: The SHAP engine for X-Ray vision.
- `synergy_map.pkl` / `matchup_map.pkl`: Pre-computed relationship matrices.

### `notebooks/`
Experimental research and sandbox environments:
- `Explainable_AI_SHAP.ipynb`: Deep dive into model feature importance.
- `Heuristic_Log_Odds_Simulation.ipynb`: Proof of the Bayesian penalty system.

### `src/`
The production source code:
- `feature_engineering.py`: Logic for converting raw draft data into ML-ready vectors.
- `config.py`: Global paths and environment constants.

### `results/`
Storage for academic plots, distribution curves, and simulation logs.

---

**Part of the Competitive Intelligence AI Research Project.**
s to ignore.