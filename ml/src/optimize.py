import pandas as pd
import numpy as np
import os
import json
import optuna
import warnings

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier

warnings.filterwarnings('ignore')

# 1. Setup Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def load_and_prep_data():
    """Loads feature data directly via feature_engineering (or simulates it) for optimization."""
    # Since feature generation is embedded in train.py in the current architecture,
    # we'll read from games.csv, recreate basic features to tune the models.
    # To maintain DRY (Don't Repeat Yourself), ideally features are pre-saved.
    # For now, we will perform a lightweight version of feature prep.
    
    # In a full production setup, the X and y matrices should be saved by a preprocessing script.
    # We will assume train.py will eventually load optimized parameters rather than duplicate logic here.
    return None, None

def objective_rf(trial, X, y):
    """Optuna objective function for tuning Random Forest."""
    n_estimators = trial.suggest_int('rf_n_estimators', 50, 300)
    max_depth = trial.suggest_int('rf_max_depth', 5, 30)
    min_samples_split = trial.suggest_int('rf_min_samples_split', 2, 10)
    
    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        random_state=42,
        n_jobs=-1
    )
    
    # 5-fold cross validation
    score = cross_val_score(clf, X, y, cv=5, scoring='accuracy').mean()
    return score

def objective_xgb(trial, X, y):
    """Optuna objective function for tuning XGBoost."""
    n_estimators = trial.suggest_int('xgb_n_estimators', 50, 300)
    max_depth = trial.suggest_int('xgb_max_depth', 3, 15)
    learning_rate = trial.suggest_float('xgb_learning_rate', 0.01, 0.3)
    subsample = trial.suggest_float('xgb_subsample', 0.6, 1.0)
    
    clf = XGBClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        learning_rate=learning_rate,
        subsample=subsample,
        eval_metric='logloss',
        random_state=42,
        n_jobs=-1
    )
    
    score = cross_val_score(clf, X, y, cv=5, scoring='accuracy').mean()
    return score

def optimize_models(X_scaled, y):
    print("🔍 Starting Hyperparameter Optimization with Optuna...")
    
    # 1. Optimize Random Forest
    print("\n🌲 Tuning Random Forest...")
    study_rf = optuna.create_study(direction='maximize', study_name="RandomForest_Tuning")
    study_rf.optimize(lambda trial: objective_rf(trial, X_scaled, y), n_trials=20)
    print(f"✅ Best RF Params: {study_rf.best_params}")
    
    # 2. Optimize XGBoost
    print("\n🚀 Tuning XGBoost...")
    study_xgb = optuna.create_study(direction='maximize', study_name="XGBoost_Tuning")
    study_xgb.optimize(lambda trial: objective_xgb(trial, X_scaled, y), n_trials=20)
    print(f"✅ Best XGB Params: {study_xgb.best_params}")
    
    # 3. Save to JSON
    best_params = {
        "Random Forest": {
            "n_estimators": study_rf.best_params['rf_n_estimators'],
            "max_depth": study_rf.best_params['rf_max_depth'],
            "min_samples_split": study_rf.best_params['rf_min_samples_split']
        },
        "XGBoost": {
            "n_estimators": study_xgb.best_params['xgb_n_estimators'],
            "max_depth": study_xgb.best_params['xgb_max_depth'],
            "learning_rate": study_xgb.best_params['xgb_learning_rate'],
            "subsample": study_xgb.best_params['xgb_subsample']
        }
    }
    
    params_path = os.path.join(MODELS_DIR, 'best_params.json')
    with open(params_path, 'w') as f:
        json.dump(best_params, f, indent=4)
        
    print(f"\n🎉 Optimization Complete! Best parameters saved to {params_path}")
    return best_params

# Note: This script is meant to be called internally by train.py or directly if you separate X,y generation.
