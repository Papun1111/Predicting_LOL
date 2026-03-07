import pandas as pd
import numpy as np
import joblib
import os

class FeatureEngineer:
    def __init__(self, champions_df, model_dir='../models'):
        self.champions_df = champions_df
        self.model_dir = model_dir
        self.champ_stats = {} 
        self.all_tags = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Support', 'Marksman']
        
    def fit(self, games_df):
        """
        Learns the win rates of every champion from the history.
        """
        print("📊 Learning Champion Statistics...")
        
        # Calculate win counts and total games per champion
        stats = {}
        for _, row in games_df.iterrows():
            winner = row['winner'] # 1 or 2
            
            # Process Team 1
            for i in range(1, 6):
                cid = row[f't1_champ{i}id']
                if cid not in stats: stats[cid] = {'wins': 0, 'games': 0}
                stats[cid]['games'] += 1
                if winner == 1: stats[cid]['wins'] += 1
                
            # Process Team 2
            for i in range(1, 6):
                cid = row[f't2_champ{i}id']
                if cid not in stats: stats[cid] = {'wins': 0, 'games': 0}
                stats[cid]['games'] += 1
                if winner == 2: stats[cid]['wins'] += 1
                
        # Compute Win Rate with Smoothing
        final_stats = {}
        for cid, data in stats.items():
            # (Wins + 10) / (Games + 20) biases towards 50% if data is scarce
            final_stats[cid] = (data['wins'] + 10) / (data['games'] + 20)
            
        self.champ_stats = final_stats
        
        # Save for later use in API
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.champ_stats, os.path.join(self.model_dir, 'champ_stats.pkl'))
        print("✅ Champion stats saved.")

    def get_team_vector(self, champion_ids):
        """
        Converts 5 IDs into a feature vector:
        [AvgWinRate, Count_Fighter, Count_Tank, ..., Count_Marksman]
        """
        # 1. Average Win Rate
        win_rates = [self.champ_stats.get(cid, 0.5) for cid in champion_ids]
        avg_wr = np.mean(win_rates)
        
        # 2. Role Counts
        role_counts = {tag: 0 for tag in self.all_tags}
        for cid in champion_ids:
            if cid in self.champions_df.index:
                tags = self.champions_df.loc[cid]['tags']
                for tag in tags:
                    if tag in role_counts:
                        role_counts[tag] += 1
                        
        vector = [avg_wr] + [role_counts[t] for t in self.all_tags]
        return vector

    def transform(self, games_df):
        print("🔄 Transforming games into training features...")
        X = []
        y = []
        
        for _, row in games_df.iterrows():
            t1_ids = [row[f't1_champ{i}id'] for i in range(1, 6)]
            t2_ids = [row[f't2_champ{i}id'] for i in range(1, 6)]
            
            vec1 = self.get_team_vector(t1_ids)
            vec2 = self.get_team_vector(t2_ids)
            
            # Final Feature: Team 1 Vector + Team 2 Vector
            X.append(vec1 + vec2)
            
            # Target: 1 if T1 won, 0 if T2 won
            y.append(1 if row['winner'] == 1 else 0)
            
        return np.array(X), np.array(y)