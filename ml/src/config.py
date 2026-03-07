import os

# Get the absolute path of the 'ml' directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Data Paths
DATA_DIR = os.path.join(BASE_DIR, 'data')
CHAMPION_INFO_PATH = os.path.join(DATA_DIR, 'champion_info.json')
CHAMPION_INFO_2_PATH = os.path.join(DATA_DIR, 'champion_info_2.json')
SPELL_INFO_PATH = os.path.join(DATA_DIR, 'summoner_spell_info.json')
GAMES_PATH = os.path.join(DATA_DIR, 'games.csv')

# Model Paths
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_FILE = os.path.join(MODELS_DIR, 'lol_prediction_model.pkl')
SCALER_FILE = os.path.join(MODELS_DIR, 'scaler.pkl')
ENCODER_FILE = os.path.join(MODELS_DIR, 'encoder.pkl')

# Constants
RANDOM_SEED = 42
TEST_SIZE = 0.2