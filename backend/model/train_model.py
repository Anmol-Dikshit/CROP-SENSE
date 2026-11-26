"""Train and evaluate crop classifiers from Crop_recommendation.csv."""
import json
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, GradientBoostingClassifier, HistGradientBoostingClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from config import DATASET_PATH, MODEL_PATH, METRICS_PATH, FEATURES, TARGET

def train():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}\n"
            "Place Crop_recommendation.csv in backend/dataset/."
        )

    df = pd.read_csv(DATASET_PATH)
    required = FEATURES + [TARGET]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing columns: {missing}. Expected: {required}")

    df = df[required].copy()
    for col in FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=[TARGET])
    if df[TARGET].nunique() < 2:
        raise ValueError("At least two crop classes are required for training.")

    X, y = df[FEATURES], df[TARGET].astype(str)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "RandomForest": RandomForestClassifier(
            n_estimators=400, max_depth=None, min_samples_split=2,
            class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "ExtraTrees": ExtraTreesClassifier(
            n_estimators=400, class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingClassifier(random_state=42),
        "HistGradientBoosting": HistGradientBoostingClassifier(random_state=42)
    }

    results = {}
    best_name, best_score, best_pipeline = None, -1, None
    for name, estimator in candidates.items():
        pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("classifier", estimator)
        ])
        pipeline.fit(X_train, y_train)
        predictions = pipeline.predict(X_test)
        score = accuracy_score(y_test, predictions)
        results[name] = {
            "test_accuracy": round(float(score), 4),
            "classification_report": classification_report(
                y_test, predictions, output_dict=True, zero_division=0
            )
        }
        if score > best_score:
            best_name, best_score, best_pipeline = name, score, pipeline

    # Refit the selected model on all labelled data after the holdout evaluation.
    best_pipeline.fit(X, y)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        "pipeline": best_pipeline,
        "features": FEATURES,
        "classes": sorted(y.unique().tolist()),
        "model_name": best_name
    }, MODEL_PATH)

    metrics = {
        "selected_model": best_name,
        "holdout_accuracy": round(float(best_score), 4),
        "rows_used": int(len(df)),
        "class_count": int(y.nunique()),
        "features": FEATURES,
        "model_comparison": {
            k: {"test_accuracy": v["test_accuracy"]} for k, v in results.items()
        },
        "reports": results
    }
    METRICS_PATH.write_text(json.dumps(metrics, indent=2))
    print(f"Selected {best_name}; holdout accuracy: {best_score:.4f}")
    print(f"Saved model: {MODEL_PATH}")
    print(f"Saved metrics: {METRICS_PATH}")
    return metrics

if __name__ == "__main__":
    train()
