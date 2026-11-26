import joblib
import numpy as np
import pandas as pd
from config import MODEL_PATH, FEATURES

class CropPredictor:
    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError("Trained model missing. Run: python model/train_model.py")
        saved = joblib.load(MODEL_PATH)
        self.pipeline = saved["pipeline"]
        self.features = saved.get("features", FEATURES)
        self.model_name = saved.get("model_name", "Classifier")

    def predict(self, values):
        row = pd.DataFrame([[values[k] for k in self.features]], columns=self.features)
        crop = str(self.pipeline.predict(row)[0])
        classifier = self.pipeline.named_steps["classifier"]
        top = []
        if hasattr(self.pipeline, "predict_proba"):
            probabilities = self.pipeline.predict_proba(row)[0]
            classes = self.pipeline.classes_
            indices = np.argsort(probabilities)[::-1][:3]
            top = [
                {"crop": str(classes[i]), "confidence": round(float(probabilities[i]) * 100, 2)}
                for i in indices
            ]
            confidence = top[0]["confidence"]
        else:
            confidence, top = None, [{"crop": crop, "confidence": None}]
        return {
            "crop": crop,
            "confidence": confidence,
            "top_recommendations": top,
            "model": self.model_name
        }
