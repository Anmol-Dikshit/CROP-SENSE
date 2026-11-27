from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path
import json
import math

from config import FEATURES, METRICS_PATH
from model.predict import CropPredictor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

predictor = None
history = []


def get_predictor():
    global predictor

    if predictor is None:
        predictor = CropPredictor()

    return predictor


@app.get("/")
def home():
    return jsonify({
        "message": "Crop Recommendation API is running",
        "endpoints": [
            "/health",
            "/predict",
            "/history",
            "/model/metrics"
        ]
    })


@app.get("/health")
def health():
    model_ready = (
        Path(__file__).resolve()
        .parent.joinpath("model", "crop_model.joblib")
        .exists()
    )

    return jsonify({
        "status": "ok",
        "model_ready": model_ready
    })


@app.post("/predict")
def predict():

    body = request.get_json(silent=True)

    if not isinstance(body, dict):
        return jsonify({
            "error": "Send a valid JSON object in the request body."
        }), 400

    missing = [
        key for key in FEATURES
        if key not in body or body[key] is None or body[key] == ""
    ]

    if missing:
        return jsonify({
            "error": "Missing required fields.",
            "fields": missing
        }), 400

    values = {}

    try:
        for key in FEATURES:
            value = float(body[key])

            if not math.isfinite(value):
                return jsonify({
                    "error": f"{key} must be a finite number."
                }), 400

            if value < 0:
                return jsonify({
                    "error": f"{key} cannot be negative."
                }), 400

            values[key] = value

    except (TypeError, ValueError):
        return jsonify({
            "error": "All input fields must contain valid numerical values."
        }), 400

    try:
        result = get_predictor().predict(values)

    except FileNotFoundError as exc:
        return jsonify({
            "error": str(exc)
        }), 503

    except Exception as exc:
        app.logger.exception("Prediction failed")

        return jsonify({
            "error": "Prediction failed.",
            "details": str(exc)
        }), 500

    record = {
        "id": len(history) + 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "inputs": values,
        **result
    }

    history.insert(0, record)
    del history[100:]

    return jsonify(record)


@app.get("/history")
def get_history():
    return jsonify({
        "history": history
    })


@app.get("/model/metrics")
def metrics():

    if not METRICS_PATH.exists():
        return jsonify({
            "error": "Metrics not found. Train the model first."
        }), 404

    return jsonify(json.loads(METRICS_PATH.read_text()))


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )
