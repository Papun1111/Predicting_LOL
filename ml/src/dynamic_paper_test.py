import os, json, joblib, warnings, math, random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

warnings.filterwarnings('ignore')
sns.set_theme(style="whitegrid", context="notebook")

# --- 1. Setup Paths & Load Models ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')

if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

print("Loading Neural Architecture & Expert Logic...")
try:
    ensemble_model = joblib.load(os.path.join(MODELS_DIR, 'ensemble_model.pkl'))
    scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
    explainer = joblib.load(os.path.join(MODELS_DIR, 'explainer.pkl'))
except FileNotFoundError:
    raise Exception("Model files not found. Please ensure train.py has been run successfully.")

# Import your exact feature extraction logic
from predict import get_features, format_factor_name

# --- 2. Load Champions ---
with open(os.path.join(DATA_DIR, 'champion_info_2.json'), 'r', encoding='utf-8') as f:
    raw = json.load(f)
    data = raw['data'] if 'data' in raw else raw
    champions_dict = {}
    if isinstance(data, dict):
        for k, v in data.items(): champions_dict[str(v['id'])] = v['name']
    else:
        for v in data: champions_dict[str(v['id'])] = v.get('name', 'Unknown')

all_champ_ids = list(champions_dict.keys())

# --- 3. Dynamic Monte Carlo Setup ---
NUM_SIMULATIONS = 1000 
results = []
blue_win_probs = [] # Storing for the final thesis chart

print(f"\n🚀 Initializing Dynamic Monte Carlo Simulation ({NUM_SIMULATIONS} matches)...")

for match_id in tqdm(range(NUM_SIMULATIONS), desc="Simulating Universes"):
    
    # 1. DYNAMIC DRAFT: Pick 10 completely random, unique champions
    draft_pool = random.sample(all_champ_ids, 10)
    team1 = draft_pool[:5]
    team2 = draft_pool[5:]
    
    blue_names = ", ".join([champions_dict[c] for c in team1])
    red_names = ", ".join([champions_dict[c] for c in team2])

    # 2. DYNAMIC SPELLS: 90% perfect, 10% chance to forget Smite (ID: 11)
    t1_spells = ["4", "4", "4", "4", "4", "11"]
    t2_spells = ["4", "4", "4", "4", "4", "11"]
    
    blue_forgot_smite = False
    red_forgot_smite = False
    
    if random.random() < 0.10:
        t1_spells.remove("11")
        blue_forgot_smite = True
        
    if random.random() < 0.10:
        t2_spells.remove("11")
        red_forgot_smite = True

    # 3. FEATURE EXTRACTION
    features = get_features(team1, team2)
    # Ensure all required columns exist in the exact order the scaler expects
    for col in scaler.feature_names_in_:
        if col not in features.columns: 
            features[col] = 0
            
    features = features[scaler.feature_names_in_]
    X = scaler.transform(features)
    
    # 4. PREDICTION ENGINE & LOG-ODDS HEURISTIC
    # Index 0 is Blue Team (class 0), Index 1 is Red Team (class 1)
    prob_blue_raw = ensemble_model.predict_proba(X)[0][0] 
    
    # Mathematically bound the probability to avoid math domain errors
    prob_blue_raw = max(0.0001, min(0.9999, prob_blue_raw))
    log_odds_blue = math.log(prob_blue_raw / (1 - prob_blue_raw))
    
    def calculate_log_penalty(spells):
        penalty = 0
        if '11' not in spells: penalty -= 1.5  # Severe penalty for no Smite
        flash_count = spells.count('4')
        penalty -= (5 - flash_count) * 0.2     # Minor penalty per missing Flash
        return penalty

    blue_penalty = calculate_log_penalty(t1_spells)
    red_penalty = calculate_log_penalty(t2_spells)

    # Bayesian Update: Combine AI logic with Expert Heuristics
    final_log_odds = log_odds_blue + blue_penalty - red_penalty
    final_prob_blue = 1 / (1 + math.exp(-final_log_odds))
    
    blue_win_probs.append(final_prob_blue * 100)
    
    # 5. X-RAY EXPLANATION ENGINE (SHAP)
    sv = explainer.shap_values(X)
    
    # Safely handle different SHAP array shapes for XGBoost binary classification
    if isinstance(sv, list):
        v = sv[0][0] 
    elif len(sv.shape) == 3:
        v = sv[0, :, 0]
    else:
        v = sv[0]
    
    top_factor_name = "None"
    top_factor_impact = 0.0
    
    # Extract the strongest base ML feature
    for feature_name, shap_val in zip(features.columns, v):
        impact = float(shap_val) * 10
        if abs(impact) > abs(top_factor_impact):
            top_factor_name = format_factor_name(feature_name)
            top_factor_impact = round(impact, 2)
            
    # Check if tactical spell mistakes override the ML model's top factor
    spell_adv = blue_penalty - red_penalty
    if abs(spell_adv) > 0:
        spell_impact = round(spell_adv * 25, 2)
        if abs(spell_impact) > abs(top_factor_impact):
            top_factor_name = "Severe Tactical Spell Error" 
            top_factor_impact = spell_impact

    # 6. SAVE TO DATASET
    results.append({
        "Match_ID": match_id + 1,
        "Blue_Team": blue_names,
        "Red_Team": red_names,
        "Blue_Missing_Smite": "YES" if blue_forgot_smite else "No",
        "Red_Missing_Smite": "YES" if red_forgot_smite else "No",
        "Blue_Win_Probability_%": round(final_prob_blue * 100, 2),
        "Red_Win_Probability_%": round((1 - final_prob_blue) * 100, 2),
        "Primary_Deciding_Factor": top_factor_name,
        "Factor_Impact": top_factor_impact
    })

# --- 4. Export & Visualize ---
df = pd.DataFrame(results)
output_path = os.path.join(RESULTS_DIR, 'dynamic_monte_carlo_results.csv')
df.to_csv(output_path, index=False)

print(f"\n✅ Monte Carlo Simulation Complete!")
print(f"📊 Dataset saved to: {output_path}")

# Generate the Proof Visualization for the Thesis
print("\n📈 Generating Probability Distribution Graph...")

plt.figure(figsize=(10, 6))
sns.histplot(blue_win_probs, bins=40, kde=True, color='#3498db')
plt.axvline(x=50, color='red', linestyle='--', linewidth=2, label='50% Baseline (Even Match)')
plt.title(f'Monte Carlo Simulation: AI Confidence Distribution ({NUM_SIMULATIONS} Matches)', fontsize=14, fontweight='bold')
plt.xlabel('Predicted Blue Team Win Probability (%)', fontsize=12)
plt.ylabel('Frequency (Number of Matches)', fontsize=12)
plt.legend()
plt.tight_layout()
plt.show()