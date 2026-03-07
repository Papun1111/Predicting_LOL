import sys, json, os, joblib, itertools, warnings, math
import pandas as pd
import numpy as np
warnings.filterwarnings('ignore')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

# --- 1. Load ALL Intelligence Files ---
ensemble_model = joblib.load(os.path.join(MODELS_DIR, 'ensemble_model.pkl'))
scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
explainer = joblib.load(os.path.join(MODELS_DIR, 'explainer.pkl'))

meta_scores = joblib.load(os.path.join(MODELS_DIR, 'meta_scores.pkl'))
synergy_map = joblib.load(os.path.join(MODELS_DIR, 'synergy_map.pkl'))
matchup_map = joblib.load(os.path.join(MODELS_DIR, 'matchup_map.pkl'))

# --- 2. Load JSON ---
with open(os.path.join(DATA_DIR, 'champion_info_2.json'), 'r') as f:
    raw = json.load(f)
    data = raw['data'] if 'data' in raw else raw
    id_to_tags = {}
    if isinstance(data, dict):
        for k, v in data.items():
            if 'id' in v: id_to_tags[str(v['id'])] = v.get('tags', [])
    else:
        for c in data: id_to_tags[str(c['id'])] = c.get('tags', [])

def get_rate(record):
    if not record: return 0.5
    return (record['wins'] + 1) / (record['games'] + 2)

# --- 3. CORE FEATURE ENGINEERING (PRESERVED) ---
def get_features(t1, t2):
    t1 = sorted([str(x) for x in t1])
    t2 = sorted([str(x) for x in t2])
    feats = {}
    
    roles = ['fighter', 'mage', 'marksman', 'assassin', 'support', 'tank']
    for r in roles: feats[f"t1_{r}"] = 0; feats[f"t2_{r}"] = 0
    
    for c in t1:
        for t in id_to_tags.get(c, []):
            if t.lower() in feats: feats[f"t1_{t.lower()}"] += 1
            elif f"t1_{t.lower()}" in feats: feats[f"t1_{t.lower()}"] += 1
            
    for c in t2:
        for t in id_to_tags.get(c, []):
            if f"t2_{t.lower()}" in feats: feats[f"t2_{t.lower()}"] += 1

    t1_ap = feats.get('t1_mage', 0) + feats.get('t1_support', 0)
    t1_ad = feats.get('t1_marksman', 0) + feats.get('t1_fighter', 0) + feats.get('t1_assassin', 0)
    feats['t1_ap_ad_ratio'] = t1_ap / (t1_ad + 1)
    
    t2_ap = feats.get('t2_mage', 0) + feats.get('t2_support', 0)
    t2_ad = feats.get('t2_marksman', 0) + feats.get('t2_fighter', 0) + feats.get('t2_assassin', 0)
    feats['t2_ap_ad_ratio'] = t2_ap / (t2_ad + 1)
            
    feats['t1_meta'] = sum(meta_scores.get(c, 0.5) for c in t1)
    feats['t2_meta'] = sum(meta_scores.get(c, 0.5) for c in t2)
    
    def calc_syn(team):
        score = 0
        for c1, c2 in itertools.combinations(team, 2):
            pair = tuple(sorted((c1, c2)))
            if pair in synergy_map:
                score += (get_rate(synergy_map[pair]) - 0.5)
        return score
    
    feats['t1_synergy'] = calc_syn(t1)
    feats['t2_synergy'] = calc_syn(t2)
    
    c_score = 0
    for c1 in t1:
        for c2 in t2:
            key = (c1, c2)
            if key in matchup_map:
                c_score += (get_rate(matchup_map[key]) - 0.5)
    feats['t1_counter'] = c_score
    
    return pd.DataFrame([feats])

def format_factor_name(name):
    mapping = {
        't1_meta': 'Blue Draft Strength',
        't2_meta': 'Red Draft Strength',
        't1_synergy': 'Blue Team Synergy',
        't2_synergy': 'Red Team Synergy',
        't1_counter': 'Blue Counter-Pick Advantage',
        't1_ap_ad_ratio': 'Blue Damage Balance', 
        't2_ap_ad_ratio': 'Red Damage Balance'   
    }
    if name in mapping: return mapping[name]
    parts = name.split('_')
    if len(parts) == 2:
        team = "Blue Team" if parts[0] == 't1' else "Red Team"
        role = parts[1].capitalize()
        return f"{team} {role}s"
    return name

if __name__ == "__main__":
    try:
        # Parse Frontend Data
        req = json.loads(sys.stdin.read())
        team1 = req.get('team1', [])
        team2 = req.get('team2', [])
        
        # Ensure spells are strings for easy counting
        t1_spells = [str(s) for s in req.get('team1Spells', [])]
        t2_spells = [str(s) for s in req.get('team2Spells', [])]
        
        # Build Features & Scale
        features = get_features(team1, team2)
        for col in scaler.feature_names_in_:
            if col not in features.columns: features[col] = 0
        features = features[scaler.feature_names_in_]
        X = scaler.transform(features)
        
        # --- 4. BASE ML PREDICTION ---
        prob_blue = ensemble_model.predict_proba(X)[0][0] 
        prob_blue = max(0.01, min(0.99, prob_blue)) # Prevent math crash
        
        # Convert base probability to Log-Odds for safe mathematical scaling
        log_odds_blue = math.log(prob_blue / (1 - prob_blue))
        
        # --- 5. THE PERFECTED SPELL HEURISTIC ---
        def get_draft_score(spells):
            # Start at 0 (Perfect Draft). Subtract points for mistakes.
            # Notice there is NO "if not spells: return 0" here. 
            # Blank arrays correctly receive massive penalties!
            score = 0
            
            # Missing Smite (ID 11) is a massive penalty
            if '11' not in spells:
                score -= 0.62 
                
            # Missing Flash (ID 4) is a moderate penalty per missing spell
            flash_count = spells.count('4')
            score -= (5 - flash_count) * 0.06 
            
            return score

        # Calculate each team's score (will be 0 or a negative number)
        blue_score = get_draft_score(t1_spells)
        red_score = get_draft_score(t2_spells)

        # Calculate the net advantage for Blue
        # If Blue gets -0.62 and Red gets 0 -> Net is -0.62 (Blue disadvantage)
        # If Blue gets 0 and Red gets -0.62 -> Net is +0.62 (Blue advantage)
        # If both get -0.62 -> Net is 0 (Fair game)
        net_blue_advantage = blue_score - red_score

        # Apply advantage and convert back to probability
        final_log_odds = log_odds_blue + net_blue_advantage
        final_prob_blue = 1 / (1 + math.exp(-final_log_odds))
        
        # --- 6. SHAP EXPLANATIONS (Blue Perspective) ---
        sv = explainer.shap_values(X)
        if isinstance(sv, list):
            v = sv[0][0] # Impact on Class 0 (Blue Team)
        else:
            v = sv[0] * -1 # Invert to represent Blue Team
        
        explanations_array = []
        raw_explanation_dict = {}
        
        for feature_name, shap_val in zip(features.columns, v):
            raw_explanation_dict[feature_name] = float(shap_val)
            impact_percent = float(shap_val) * 10 
            
            if abs(impact_percent) > 0.5:
                explanations_array.append({
                    "factor": format_factor_name(feature_name),
                    "impact": round(impact_percent, 2)
                })
                
        # --- 7. INJECT SPELL ADVANTAGE INTO DASHBOARD ---
        # Only inject the bar if someone actually has a tactical advantage
        if abs(net_blue_advantage) > 0.05:
            explanations_array.append({
                "factor": "Tactical Spell Advantage",
                "impact": round(net_blue_advantage * 25, 2) # Positive helps Blue, Negative hurts Blue
            })
        
        # Sort factors by biggest impact
        explanations_array.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        # 8. OUTPUT RESPONSE
        print(json.dumps({
            "winProbability": float(final_prob_blue), 
            "explanation": raw_explanation_dict,     
            "explanations": explanations_array[:10]  
        }))
    except Exception as e:
        print(json.dumps({"error": str(e)}))