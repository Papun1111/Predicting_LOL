
import pandas as pd
import numpy as np
import os
import json
import itertools
import warnings
import joblib
import shap
import argparse
import mlflow
import mlflow.sklearn

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, roc_auc_score

# The 8 Model Architectures
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier

warnings.filterwarnings('ignore')

# 1. Setup Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

def get_role_counts(ids, id_to_tags):
    roles = ['fighter', 'mage', 'marksman', 'assassin', 'support', 'tank']
    counts = {role: 0 for role in roles}
    for cid in ids:
        tags = id_to_tags.get(str(cid), [])
        for tag in tags:
            tag_l = tag.lower()
            if tag_l in counts: counts[tag_l] += 1
    return counts

def train(tune=False):
    print("🚀 Starting Deep-Dive Training (Synergy, Counters, Meta, Damage Types)...")
    
    # 2. Load Resources
    csv_path = os.path.join(DATA_DIR, 'games.csv')
    json_path = os.path.join(DATA_DIR, 'champion_info_2.json')
    
    df = pd.read_csv(csv_path)
    with open(json_path, 'r', encoding='utf-8') as f:
        raw = json.load(f)
    
    data = raw['data'] if 'data' in raw else raw
    id_to_tags = {}
    if isinstance(data, dict):
        for k, v in data.items():
            if 'id' in v:
                id_to_tags[str(v['id'])] = v.get('tags', [])
    else:
        for c in data:
            id_to_tags[str(c['id'])] = c.get('tags', [])

    # 3. Dynamic Column Detection
    cols = df.columns.tolist()
    t1_cols = [c for c in cols if ('t1' in c.lower() or 'team1' in c.lower()) and 'id' in c.lower()][:5]
    t2_cols = [c for c in cols if ('t2' in c.lower() or 'team2' in c.lower()) and 'id' in c.lower()][:5]
    
    if not t1_cols: 
         t1_cols = [c for c in cols if ('t1' in c.lower() or 'team1' in c.lower()) and 'win' not in c.lower()][:5]
         t2_cols = [c for c in cols if ('t2' in c.lower() or 'team2' in c.lower()) and 'win' not in c.lower()][:5]

    print(f"📊 Using Columns: T1={t1_cols}, T2={t2_cols}")

    # --- PHASE 1: MINING RELATIONSHIPS ---
    print("⛏️  Mining Intelligence...")
    
    champ_stats = {} 
    synergy_map = {} 
    matchup_map = {} 

    total_games = len(df)
    
    for _, row in df.iterrows():
        winner = row['winner'] 
        
        t1 = sorted([str(row[c]) for c in t1_cols])
        t2 = sorted([str(row[c]) for c in t2_cols])
        
        if winner == 1:
            winning_team, losing_team = t1, t2
        else:
            winning_team, losing_team = t2, t1

        for team, is_win in [(t1, winner==1), (t2, winner==2)]:
            for cid in team:
                if cid not in champ_stats: champ_stats[cid] = {'wins':0, 'games':0}
                champ_stats[cid]['games'] += 1
                if is_win: champ_stats[cid]['wins'] += 1
            
            for c1, c2 in itertools.combinations(team, 2):
                pair = tuple(sorted((c1, c2)))
                if pair not in synergy_map: synergy_map[pair] = {'wins':0, 'games':0}
                synergy_map[pair]['games'] += 1
                if is_win: synergy_map[pair]['wins'] += 1
        
        for w_id in winning_team:
            for l_id in losing_team:
                key = (w_id, l_id) 
                if key not in matchup_map: matchup_map[key] = {'wins':0, 'games':0}
                matchup_map[key]['games'] += 1
                matchup_map[key]['wins'] += 1
                
                rev_key = (l_id, w_id) 
                if rev_key not in matchup_map: matchup_map[rev_key] = {'wins':0, 'games':0}
                matchup_map[rev_key]['games'] += 1

    # --- PHASE 2: CALCULATE & SAVE SCORES ---
    print("📊 Compiling Scores...")
    
    def get_rate(record):
        if not record: return 0.5
        return (record['wins'] + 1) / (record['games'] + 2)

    meta_scores = {}
    for cid, stats in champ_stats.items():
        wr = get_rate(stats)
        pr = stats['games'] / total_games
        meta_scores[cid] = (wr * 0.7) + (pr * 0.3)

    joblib.dump(meta_scores, os.path.join(MODELS_DIR, 'meta_scores.pkl'))
    joblib.dump(synergy_map, os.path.join(MODELS_DIR, 'synergy_map.pkl'))
    joblib.dump(matchup_map, os.path.join(MODELS_DIR, 'matchup_map.pkl'))

    # --- PHASE 3: FEATURE ENGINEERING ---
    print("🧠 Engineering Features...")
    
    X_data = []
    y_data = []

    for _, row in df.iterrows():
        t1 = sorted([str(row[c]) for c in t1_cols])
        t2 = sorted([str(row[c]) for c in t2_cols])
        
        feats = {}
        
        t1_roles = get_role_counts(t1, id_to_tags)
        t2_roles = get_role_counts(t2, id_to_tags)
        for k, v in t1_roles.items(): feats[f"t1_{k}"] = v
        for k, v in t2_roles.items(): feats[f"t2_{k}"] = v
        
        # AP/AD Damage Balance Feature
        t1_ap = t1_roles.get('mage', 0) + t1_roles.get('support', 0)
        t1_ad = t1_roles.get('marksman', 0) + t1_roles.get('fighter', 0) + t1_roles.get('assassin', 0)
        feats['t1_ap_ad_ratio'] = t1_ap / (t1_ad + 1) # +1 prevents division by zero
        
        t2_ap = t2_roles.get('mage', 0) + t2_roles.get('support', 0)
        t2_ad = t2_roles.get('marksman', 0) + t2_roles.get('fighter', 0) + t2_roles.get('assassin', 0)
        feats['t2_ap_ad_ratio'] = t2_ap / (t2_ad + 1)
        
        feats['t1_meta'] = sum(meta_scores.get(c, 0.5) for c in t1)
        feats['t2_meta'] = sum(meta_scores.get(c, 0.5) for c in t2)
        
        def team_synergy(team):
            score = 0
            for c1, c2 in itertools.combinations(team, 2):
                pair = tuple(sorted((c1, c2)))
                if pair in synergy_map:
                    score += (get_rate(synergy_map[pair]) - 0.5)
            return score
            
        feats['t1_synergy'] = team_synergy(t1)
        feats['t2_synergy'] = team_synergy(t2)
        
        adv = 0
        for c1 in t1:
            for c2 in t2:
                key = (c1, c2)
                if key in matchup_map:
                    adv += (get_rate(matchup_map[key]) - 0.5)
        feats['t1_counter'] = adv
        
        X_data.append(feats)
        y_data.append(1 if row['winner'] == 2 else 0)

    X = pd.DataFrame(X_data)
    y = pd.Series(y_data)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    scaler.feature_names_in_ = X.columns.tolist()
    joblib.dump(scaler, os.path.join(MODELS_DIR, 'scaler.pkl'))

    # --- PHASE 4: ENSEMBLE TRAINING & EVALUATION (THE 8-MODEL GAUNTLET) ---
    print("⚔️ Entering the Model Arena: Training 8 distinct architectures...")
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # --- OPTIONAL: HYPERPARAMETER TUNING ---
    best_params_path = os.path.join(MODELS_DIR, 'best_params.json')
    if tune:
        try:
            from optimize import optimize_models
            optimize_models(X_scaled, y)
        except ImportError as e:
            print(f"⚠️ Could not import optimize module: {e}. Are you sure optimize.py exists in src/?")

    # Default parameters
    rf_params = {'n_estimators': 100, 'max_depth': 10, 'random_state': 42, 'n_jobs': -1}
    xgb_params = {'n_estimators': 200, 'max_depth': 6, 'learning_rate': 0.05, 'eval_metric': 'logloss', 'random_state': 42, 'n_jobs': -1}

    if os.path.exists(best_params_path):
        print(f"📈 Loading Optimized Hyperparameters from {best_params_path}...")
        with open(best_params_path, 'r') as f:
            bp = json.load(f)
            
        if "Random Forest" in bp:
            rf_params.update(bp["Random Forest"])
        if "XGBoost" in bp:
            xgb_params.update(bp["XGBoost"])
    else:
        print("ℹ️ Using default hyperparameters. Run with --tune to optimize.")

    # 1. Define the 7 Base Models
    models_dict = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Naive Bayes': GaussianNB(),
        'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=7),
        'Random Forest': RandomForestClassifier(**rf_params),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'XGBoost': XGBClassifier(**xgb_params),
        'Deep Learning (ANN)': MLPClassifier(hidden_layer_sizes=(128, 64), activation='relu', max_iter=300, random_state=42)
    }

    # 2. Define the Stacking Ensemble
    base_estimators = [
        ('rf', models_dict['Random Forest']),
        ('xgb', models_dict['XGBoost'])
    ]
    ensemble_model = StackingClassifier(
        estimators=base_estimators,
        final_estimator=LogisticRegression(),
        cv=5
    )

    metrics = {"models": {}, "roc_data": []}
    
    common_fpr = np.linspace(0, 1, 20)
    roc_dict = {"fpr": common_fpr.tolist()}

    # 3. Train and evaluate the 7 base models
    for name, model_instance in models_dict.items():
        print(f"   -> Training {name}...")
        model_instance.fit(X_train, y_train)
        y_pred = model_instance.predict(X_test)
        
        y_pred_proba = model_instance.predict_proba(X_test)[:, 1] 
        
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
        auc_score = roc_auc_score(y_test, y_pred_proba)
        
        interp_tpr = np.interp(common_fpr, fpr, tpr)
        interp_tpr[0] = 0.0 
        roc_dict[name.upper()] = interp_tpr.tolist()
        
        # Extract Confusion Matrix values
        cm = confusion_matrix(y_test, y_pred)
        tn_sk, fp_sk, fn_sk, tp_sk = cm.ravel()
        
        metrics["models"][name] = {
            "name": name,
            "Accuracy": float(accuracy_score(y_test, y_pred)),
            "Precision": float(precision_score(y_test, y_pred, zero_division=0)),
            "Recall": float(recall_score(y_test, y_pred, zero_division=0)),
            "F1-Score": float(f1_score(y_test, y_pred, zero_division=0)),
            "auc": round(float(auc_score), 4),
            "confusion_matrix": cm.tolist(),
            "TP (Correct Blue)": int(tn_sk), 
            "FN (Wrong Red)": int(fp_sk),
            "FP (Wrong Blue)": int(fn_sk),
            "TN (Correct Red)": int(tp_sk)
        }

        # Keep your specific SHAP TreeExplainer extraction for XGBoost intact
        if name == 'XGBoost':
            joblib.dump(model_instance, os.path.join(MODELS_DIR, 'model.pkl'))
            joblib.dump(shap.TreeExplainer(model_instance), os.path.join(MODELS_DIR, 'explainer.pkl'))

    # 4. Train and evaluate the Final Stacking Ensemble
    print("   -> Training STACKING ENSEMBLE...")
    ensemble_model.fit(X_train, y_train)
    y_pred_ens = ensemble_model.predict(X_test)
    
    y_pred_proba_ens = ensemble_model.predict_proba(X_test)[:, 1]
    fpr_ens, tpr_ens, _ = roc_curve(y_test, y_pred_proba_ens)
    auc_score_ens = roc_auc_score(y_test, y_pred_proba_ens)
    
    interp_tpr_ens = np.interp(common_fpr, fpr_ens, tpr_ens)
    interp_tpr_ens[0] = 0.0
    roc_dict["STACKING ENSEMBLE"] = interp_tpr_ens.tolist()
    
    cm_ens = confusion_matrix(y_test, y_pred_ens)
    tn_ens, fp_ens, fn_ens, tp_ens = cm_ens.ravel()
    
    metrics["models"]["Stacking Ensemble"] = {
        "name": "STACKING ENSEMBLE",
        "Accuracy": float(accuracy_score(y_test, y_pred_ens)),
        "Precision": float(precision_score(y_test, y_pred_ens, zero_division=0)),
        "Recall": float(recall_score(y_test, y_pred_ens, zero_division=0)),
        "F1-Score": float(f1_score(y_test, y_pred_ens, zero_division=0)),
        "auc": round(float(auc_score_ens), 4),
        "confusion_matrix": cm_ens.tolist(),
        "TP (Correct Blue)": int(tn_ens),
        "FN (Wrong Red)": int(fp_ens),
        "FP (Wrong Blue)": int(fn_ens),
        "TN (Correct Red)": int(tp_ens)
    }

    # --- 5. LOG TO MLFLOW (Experiment Tracking) ---
    print("\n📝 Logging run to MLflow...")
    mlflow.set_experiment("League_of_Legends_Predictor")
    
    with mlflow.start_run(run_name="Optimized_Ensemble_Run" if tune else "Default_Ensemble_Run"):
        # Log Hyperparameters used for the base models
        mlflow.log_params({"rf_n_estimators": rf_params.get('n_estimators')})
        mlflow.log_params({"rf_max_depth": rf_params.get('max_depth')})
        mlflow.log_params({"xgb_n_estimators": xgb_params.get('n_estimators')})
        mlflow.log_params({"xgb_max_depth": xgb_params.get('max_depth')})
        mlflow.log_params({"xgb_learning_rate": xgb_params.get('learning_rate')})
        
        # Log Final Ensemble Metrics
        mlflow.log_metric("Accuracy", metrics["models"]["Stacking Ensemble"]["Accuracy"])
        mlflow.log_metric("Precision", metrics["models"]["Stacking Ensemble"]["Precision"])
        mlflow.log_metric("Recall", metrics["models"]["Stacking Ensemble"]["Recall"])
        mlflow.log_metric("F1-Score", metrics["models"]["Stacking Ensemble"]["F1-Score"])
        mlflow.log_metric("AUCROC", metrics["models"]["Stacking Ensemble"]["auc"])
        
        # Log the actual trained model to the MLflow registry
        mlflow.sklearn.log_model(ensemble_model, "Stacking_Ensemble_Model")
        
        # Log the features list for reproducibility
        with open(os.path.join(MODELS_DIR, "features.txt"), "w") as f:
            f.write(",".join(X.columns.tolist()))
        mlflow.log_artifact(os.path.join(MODELS_DIR, "features.txt"))
        
    print("✅ MLflow Logging Complete!")

    # Format roc_dict for React Recharts LineChart
    for i in range(len(common_fpr)):
        point = {"fpr": round(common_fpr[i], 2)}
        for key in roc_dict:
            if key != "fpr":
                point[key] = round(roc_dict[key][i], 3)
        metrics["roc_data"].append(point)

    joblib.dump(ensemble_model, os.path.join(MODELS_DIR, 'ensemble_model.pkl'))
    
    metrics_path = os.path.join(DATA_DIR, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4) 

    print(f"\n✅ Gauntlet Complete! All 8 models trained.")
    print(f"✅ Metrics securely saved to {metrics_path} for your React Frontend.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train League of Legends AI Predictor")
    parser.add_argument('--tune', action='store_true', help='Run Optuna hyperparameter tuning before training')
    args = parser.parse_args()
    
    train(tune=args.tune)
