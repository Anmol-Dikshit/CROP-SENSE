from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset" / "Crop Recommendation dataset.csv"
MODEL_PATH = BASE_DIR / "model" / "crop_model.joblib"
METRICS_PATH = BASE_DIR / "model" / "training_metrics.json"

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET = "label"
