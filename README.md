# Crop Recommendation Backend

Flask REST API + scikit-learn model training, designed for the supplied React frontend.

## 1. Dataset

Place `Crop_recommendation.csv` in `backend/dataset/`.

Required columns (case-sensitive):
`N, P, K, temperature, humidity, ph, rainfall, label`

The `label` column contains the crop class. The training script checks columns and
class distribution before training. It compares Random Forest, Extra Trees,
Gradient Boosting and HistGradientBoosting using a stratified 80/20 holdout split,
then saves the best holdout performer refitted on the full dataset.

## 2. Setup (from this backend folder)

Windows:
```powershell
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python model/train_model.py
python app.py
```

macOS/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python model/train_model.py
python app.py
```

API runs at `http://localhost:5000`.

## 3. API

- `GET /health` — server/model status
- `POST /predict` — crop recommendation
- `GET /history` — recent in-memory predictions
- `GET /model/metrics` — holdout accuracy and per-class report

Example request:
```json
{
  "N": 90, "P": 42, "K": 43,
  "temperature": 20.8, "humidity": 82,
  "ph": 6.5, "rainfall": 202
}
```

Prediction response contains `crop`, `confidence`, `top_recommendations`,
`model`, input values and timestamp.

## 4. Frontend

The supplied React app already posts to `http://localhost:5000/predict`.
The Recommendation page was updated to call this endpoint and display the
returned crop, confidence and top recommendations.

## Important limitations

- The model learns correlations in its training dataset; it is not a substitute
  for local agronomic advice or a soil laboratory test.
- The dataset does not include location, season, irrigation, seed variety,
  market price or disease pressure. Predictions may not generalize to every farm.
- No fertilizer recommendation is generated: the supplied frontend's fertilizer
  placeholder was not backed by a fertilizer dataset/model. Do not treat a guessed
  fertilizer as a scientific recommendation.
- Prediction history is in memory only and resets when the API restarts.
  Add a database if persistent user-specific history is needed.
- The reported holdout score is an evaluation on one split, not a guarantee of
  real-world accuracy. For a stronger evaluation, test on independent regional data.
