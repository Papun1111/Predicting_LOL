import sys, json, os, joblib, itertools, warnings
import pandas as pd
import numpy as np
warnings.filterwarnings('ignore')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Load ALL Intelligence
# UPGRADE 1: We now use the full Stacking Ensemble instead of just XGBoost
model = joblib.load(os.path.join(MODELS_DIR, 'ensemble_model.pkl'))
scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
meta_scores = joblib.load(os.path.join(MODELS_DIR, 'meta_scores.pkl'))
synergy_map = joblib.load(os.path.join(MODELS_DIR, 'synergy_map.pkl'))
matchup_map = joblib.load(os.path.join(MODELS_DIR, 'matchup_map.pkl'))

with open(os.path.join(DATA_DIR, 'champion_info_2.json'), 'r') as f:
    raw = json.load(f)
    data = raw['data'] if 'data' in raw else raw
    champ_lookup = {}
    if isinstance(data, dict):
        for k, v in data.items():
            if 'id' in v: champ_lookup[str(v['id'])] = {'name': v.get('name'), 'tags': v.get('tags', [])}
    else:
        for c in data: champ_lookup[str(c['id'])] = {'name': c.get('name'), 'tags': c.get('tags', [])}

def get_rate(record):
    if not record: return 0.5
    return (record['wins'] + 1) / (record['games'] + 2)

if __name__ == "__main__":
    try:
        req = json.loads(sys.stdin.read())
        my_team = [str(x) for x in req.get('myTeam', [])]
        enemy_team = [str(x) for x in req.get('enemyTeam', [])]
        
        # Pre-calculate Enemy Stats (Constant)
        e_roles = {f"t2_{r}": 0 for r in ['fighter','mage','marksman','assassin','support','tank']}
        for c in enemy_team:
            for t in champ_lookup.get(c, {}).get('tags', []):
                e_roles[f"t2_{t.lower()}"] += 1
                
        # UPGRADE 2: Calculate Enemy AP/AD Damage Balance
        e_ap = e_roles.get('t2_mage', 0) + e_roles.get('t2_support', 0)
        e_ad = e_roles.get('t2_marksman', 0) + e_roles.get('t2_fighter', 0) + e_roles.get('t2_assassin', 0)
        e_ap_ad_ratio = e_ap / (e_ad + 1)
        
        e_meta = sum(meta_scores.get(c, 0.5) for c in enemy_team)
        e_syn = 0
        for c1, c2 in itertools.combinations(enemy_team, 2):
            pair = tuple(sorted((c1, c2)))
            if pair in synergy_map: e_syn += (get_rate(synergy_map[pair]) - 0.5)

        rows = []
        candidates = []
        taken = set(my_team + enemy_team)
        
        for cid, info in champ_lookup.items():
            if cid in taken or cid == "-1": continue
            
            temp_team = my_team + [cid]
            
            # 1. Roles
            m_roles = {f"t1_{r}": 0 for r in ['fighter','mage','marksman','assassin','support','tank']}
            for c in temp_team:
                for t in champ_lookup.get(c, {}).get('tags', []):
                    m_roles[f"t1_{t.lower()}"] += 1
                    
            # UPGRADE 3: Protect against All-AP or All-AD Comps by computing our damage ratio
            m_ap = m_roles.get('t1_mage', 0) + m_roles.get('t1_support', 0)
            m_ad = m_roles.get('t1_marksman', 0) + m_roles.get('t1_fighter', 0) + m_roles.get('t1_assassin', 0)
            m_ap_ad_ratio = m_ap / (m_ad + 1)
            
            # 2. Meta
            m_meta = sum(meta_scores.get(c, 0.5) for c in temp_team)
            
            # 3. Synergy
            m_syn = 0
            for c1, c2 in itertools.combinations(temp_team, 2):
                pair = tuple(sorted((c1, c2)))
                if pair in synergy_map: m_syn += (get_rate(synergy_map[pair]) - 0.5)
            
            # 4. Counter
            c_adv = 0
            for c1 in temp_team:
                for c2 in enemy_team:
                    key = (c1, c2)
                    if key in matchup_map: c_adv += (get_rate(matchup_map[key]) - 0.5)

            row = m_roles.copy()
            row.update(e_roles)
            row['t1_meta'] = m_meta
            row['t2_meta'] = e_meta
            row['t1_synergy'] = m_syn
            row['t2_synergy'] = e_syn
            row['t1_counter'] = c_adv
            
            # Inject the AP/AD ratios into the testing dataframe
            row['t1_ap_ad_ratio'] = m_ap_ad_ratio
            row['t2_ap_ad_ratio'] = e_ap_ad_ratio
            
            rows.append(row)
            candidates.append(cid)

        if not rows: print(json.dumps([])); sys.exit(0)

        df = pd.DataFrame(rows)
        # Force Alignment with Training Columns
        for col in scaler.feature_names_in_:
            if col not in df.columns: df[col] = 0
        df = df[scaler.feature_names_in_]
        
        X = scaler.transform(df)
        # UPGRADE 4: Using predict_proba from the Ensemble. Class 0 = Team 1 Wins. 
        probs = model.predict_proba(X)[:, 0] 

        results = []
        for i, cid in enumerate(candidates):
            results.append({
                "id": cid,
                "name": champ_lookup[cid]['name'],
                "roles": champ_lookup[cid]['tags'],
                "score": float(probs[i] * 100)
            })

        results.sort(key=lambda x: x['score'], reverse=True)
        print(json.dumps(results[:10]))

    except Exception as e:
        print(json.dumps([]))