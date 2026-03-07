import pandas as pd
import json
import os

def load_data(data_dir='data'):
    print("⏳ Loading data files...")
    
    # 1. Load Champion Info 1 (Maps ID -> Key/Name)
    with open(os.path.join(data_dir, 'champion_info.json'), encoding='utf-8') as f:
        c1 = json.load(f)

    # 2. Load Champion Info 2 (Maps Key -> Tags)
    with open(os.path.join(data_dir, 'champion_info_2.json'), encoding='utf-8') as f:
        c2 = json.load(f)

    # 3. Load Games CSV
    games_path = os.path.join(data_dir, 'games.csv')
    games_df = pd.read_csv(games_path)

    # 4. Load Spells (This was missing in your version!)
    spells_path = os.path.join(data_dir, 'summoner_spell_info.json')
    with open(spells_path, encoding='utf-8') as f:
        spells = json.load(f)

    # --- Merge Logic ---
    champ_map = {}

    # Step A: Get ID to Key mapping
    id_to_key = {}
    if 'data' in c1:
        for k, v in c1['data'].items():
            id_to_key[int(v['id'])] = v['key']

    # Step B: Get Key to Tags mapping
    key_to_tags = {}
    if 'data' in c2:
        for k, v in c2['data'].items():
            key_to_tags[k] = v.get('tags', [])

    # Step C: Combine them
    for cid, key in id_to_key.items():
        champ_map[cid] = {
            'key': key,
            'tags': key_to_tags.get(key, []) 
        }

    # Convert to DataFrame
    champions_df = pd.DataFrame.from_dict(champ_map, orient='index')
    champions_df.index.name = 'championId'
    
    print(f"✅ Loaded {len(champions_df)} champions, {len(games_df)} games, and spells.")
    
    # RETURN 3 VALUES
    return champions_df, games_df, spells 

if __name__ == "__main__":
    load_data('../data')