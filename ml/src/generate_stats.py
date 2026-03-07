import pandas as pd
import json
import os
import itertools
from collections import defaultdict

# Setup Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')

def generate():
    print("📊 Generating Champion Stats for Dashboard...")
    
    # 1. Load Data
    csv_path = os.path.join(DATA_DIR, 'games.csv')
    if not os.path.exists(csv_path):
        print("❌ games.csv not found!")
        return

    df = pd.read_csv(csv_path)
    total_games = len(df)
    
    # 2. Initialize Containers
    # champ_stats = { id: { wins, games, bans } }
    champ_stats = defaultdict(lambda: {'wins': 0, 'games': 0, 'bans': 0})
    
    # synergy = { id1: { id2: { wins, games } } }
    synergy = defaultdict(lambda: defaultdict(lambda: {'wins': 0, 'games': 0}))
    
    # matchups = { id1: { id2: { wins, games } } } (How id1 performs VS id2)
    matchups = defaultdict(lambda: defaultdict(lambda: {'wins': 0, 'games': 0}))

    # 3. Process Columns
    t1_cols = ['t1_champ1id', 't1_champ2id', 't1_champ3id', 't1_champ4id', 't1_champ5id']
    t2_cols = ['t2_champ1id', 't2_champ2id', 't2_champ3id', 't2_champ4id', 't2_champ5id']
    ban_cols = ['t1_ban1', 't1_ban2', 't1_ban3', 't1_ban4', 't1_ban5', 
                't2_ban1', 't2_ban2', 't2_ban3', 't2_ban4', 't2_ban5']

    print("   ...processing matches (this might take a moment)")

    # 4. Count Global Stats (Vectorized for speed)
    # Bans
    for col in ban_cols:
        counts = df[col].value_counts()
        for cid, count in counts.items():
            champ_stats[str(cid)]['bans'] += count
            
    # Picks & Wins
    # We iterate row by row for synergy/matchups (accurate but slower)
    # optimized by pre-calculating groups
    
    for row in df.itertuples(index=False):
        # Row structure depends on column order, let's just assume columns are accessible by name
        # A safer way is using to_dict or zip, but for speed let's use the known column indices or names
        # Actually, let's just stick to the robust logic we used before
        
        winner = row.winner # 1 or 2
        
        # Extract Teams
        # getattr is safe for namedtuples
        t1 = [str(getattr(row, c)) for c in t1_cols]
        t2 = [str(getattr(row, c)) for c in t2_cols]
        
        # Determine Winner
        if winner == 1:
            win_team, lose_team = t1, t2
        else:
            win_team, lose_team = t2, t1
            
        # Update Picks & Wins
        for cid in t1:
            champ_stats[cid]['games'] += 1
            if winner == 1: champ_stats[cid]['wins'] += 1
            
        for cid in t2:
            champ_stats[cid]['games'] += 1
            if winner == 2: champ_stats[cid]['wins'] += 1

        # Update Synergy (Pairs in Winning Team)
        # We only care about winning pairs to find "Good Synergy"
        for team, is_win in [(t1, winner==1), (t2, winner==2)]:
            for c1, c2 in itertools.combinations(team, 2):
                # c1 with c2
                synergy[c1][c2]['games'] += 1
                synergy[c2][c1]['games'] += 1
                if is_win:
                    synergy[c1][c2]['wins'] += 1
                    synergy[c2][c1]['wins'] += 1

        # Update Matchups (Winner VS Loser)
        # We want to know: "How does C1 do against C2?"
        for w in win_team:
            for l in lose_team:
                # W beat L
                matchups[w][l]['games'] += 1
                matchups[w][l]['wins'] += 1 # Win for W
                
                matchups[l][w]['games'] += 1
                # Loss for L (no win increment)

    # 5. Compile Final JSON
    print("   ...compiling results")
    final_data = {}
    
    for cid, stats in champ_stats.items():
        if stats['games'] == 0: continue
        
        win_rate = stats['wins'] / stats['games']
        pick_rate = stats['games'] / total_games
        ban_rate = stats['bans'] / total_games
        
        # Top 5 Synergies (Highest Win Rate with partner, min 10 games)
        syn_list = []
        for partner, s_stats in synergy[cid].items():
            if s_stats['games'] > 10:
                syn_list.append({
                    "id": partner,
                    "winRate": s_stats['wins'] / s_stats['games'],
                    "games": s_stats['games']
                })
        syn_list.sort(key=lambda x: x['winRate'], reverse=True)
        
        # Top 5 Counters (Lowest Win Rate VS enemy, min 10 games)
        # Meaning: When I play CID against ENEMY, my winrate is low.
        counter_list = []
        for enemy, m_stats in matchups[cid].items():
            if m_stats['games'] > 10:
                counter_list.append({
                    "id": enemy,
                    "winRate": m_stats['wins'] / m_stats['games'], # My winrate vs them
                    "games": m_stats['games']
                })
        counter_list.sort(key=lambda x: x['winRate']) # Ascending (Low winrate = Hard Counter)
        
        final_data[cid] = {
            "winRate": round(win_rate, 4),
            "pickRate": round(pick_rate, 4),
            "banRate": round(ban_rate, 4),
            "games": stats['games'],
            "synergies": syn_list[:5],
            "counters": counter_list[:5]
        }

    # 6. Save
    out_path = os.path.join(DATA_DIR, 'champion_full_stats.json')
    with open(out_path, 'w') as f:
        json.dump(final_data, f)
        
    print(f"✅ Stats saved to {out_path}")

if __name__ == "__main__":
    generate()