import os, warnings
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Hide warnings for clean execution
warnings.filterwarnings('ignore')

# --- 1. Setup Paths ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULTS_DIR = os.path.join(BASE_DIR, 'results')
PLOTS_DIR = os.path.join(RESULTS_DIR, 'plots')

if not os.path.exists(PLOTS_DIR):
    os.makedirs(PLOTS_DIR)

csv_path = os.path.join(RESULTS_DIR, 'dynamic_monte_carlo_results.csv')

# --- 2. Load Data ---
try:
    df = pd.read_csv(csv_path)
    print(f"✅ Successfully loaded {len(df)} simulated matches for visualization.")
except FileNotFoundError:
    print("❌ Error: Could not find dynamic_monte_carlo_results.csv.")
    print("Please run your Monte Carlo simulation script first!")
    exit()

# Set professional academic styling
sns.set_theme(style="whitegrid", context="paper", font_scale=1.2)

# ==============================================================================
# 📊 GRAPH 1: Probability Distribution (The Baseline Proof)
# ==============================================================================
print("Generating Graph 1: Probability Distribution...")
plt.figure(figsize=(10, 6))
# Fixed: Switched to explicitly defining x= to avoid ambiguity
sns.histplot(data=df, x='Blue_Win_Probability_%', bins=30, kde=True, color='#3498db', edgecolor='black')
plt.title('Distribution of Predicted Win Probabilities (1,000 Matches)', fontsize=14, fontweight='bold')
plt.xlabel('Blue Team Win Probability (%)', fontsize=12)
plt.ylabel('Frequency (Number of Matches)', fontsize=12)
plt.axvline(x=50, color='red', linestyle='--', linewidth=1.5, label='50% Baseline (Even Match)')
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'figure1_probability_distribution.png'), dpi=300)
plt.close()

# ==============================================================================
# 📊 GRAPH 2: The Heuristic Impact (Proving the Expert Logic)
# ==============================================================================
print("Generating Graph 2: Heuristic Impact...")
plt.figure(figsize=(10, 6))

# Create a new column to cleanly categorize the match states
def categorize_mistakes(row):
    if row['Blue_Missing_Smite'] == 'YES' and row['Red_Missing_Smite'] == 'YES':
        return 'Both Missing Smite'
    elif row['Blue_Missing_Smite'] == 'YES':
        return 'Blue Missing Smite'
    elif row['Red_Missing_Smite'] == 'YES':
        return 'Red Missing Smite'
    else:
        return 'Standard Draft (Perfect Spells)'

df['Draft_Scenario'] = df.apply(categorize_mistakes, axis=1)

# Order the boxplot logically
order = ['Red Missing Smite', 'Standard Draft (Perfect Spells)', 'Both Missing Smite', 'Blue Missing Smite']

# Fixed: Added hue='Draft_Scenario' and legend=False to prevent Seaborn FutureWarnings
sns.boxplot(
    x='Draft_Scenario', 
    y='Blue_Win_Probability_%', 
    data=df, 
    order=order, 
    hue='Draft_Scenario',
    palette=['#2ecc71', '#95a5a6', '#f1c40f', '#e74c3c'],
    legend=False
)

plt.title('Impact of Tactical Spell Errors on Win Probability', fontsize=14, fontweight='bold')
plt.xlabel('Draft Scenario (Summoner Spells)', fontsize=12)
plt.ylabel('Blue Team Win Probability (%)', fontsize=12)
plt.axhline(y=50, color='black', linestyle=':', linewidth=1.5)
plt.xticks(rotation=15)
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'figure2_heuristic_impact.png'), dpi=300)
plt.close()

# ==============================================================================
# 📊 GRAPH 3: Explainable AI Factors (What drives the prediction?)
# ==============================================================================
print("Generating Graph 3: SHAP Deciding Factors...")
plt.figure(figsize=(11, 6))
factor_counts = df['Primary_Deciding_Factor'].value_counts().head(8) # Top 8 factors

# Fixed: Added hue and legend=False
ax = sns.barplot(
    y=factor_counts.index, 
    x=factor_counts.values, 
    hue=factor_counts.index,
    palette='viridis',
    legend=False
)

# Added Visual Polish: Put the exact number count at the end of each bar
for p in ax.patches:
    width = p.get_width()
    plt.text(width + 5, p.get_y() + p.get_height() / 2., int(width), ha="left", va="center")

plt.title('Primary Deciding Factors Across 1,000 Simulated Matches (SHAP)', fontsize=14, fontweight='bold')
plt.xlabel('Number of Matches where Factor was the #1 Driver', fontsize=12)
plt.ylabel('Machine Learning Feature', fontsize=12)
# Add some padding to the right so the text labels don't get cut off
plt.xlim(0, max(factor_counts.values) * 1.15) 
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'figure3_shap_factors.png'), dpi=300)
plt.close()

print(f"\n🎉 Visualizations Generated Successfully!")
print(f"📂 Check the '{PLOTS_DIR}' folder for your high-resolution PNGs.")