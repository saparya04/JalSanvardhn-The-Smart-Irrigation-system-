from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the encoder and the model
encoder = joblib.load("label_encoder.pkl")
model = joblib.load("logistic_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Convert input data to DataFrame
        input_data = pd.DataFrame([data])

        # Apply encoding to categorical features
        encoded_data = encoder.transform(input_data)

        # Ensure the encoded features match the model's expected features
        model_features = model.feature_names_in_
        encoded_data = encoded_data.reindex(columns=model_features, fill_value=0)

        # Make prediction
        prediction = model.predict(encoded_data)[0]
        irrigation_required = bool(prediction)  # Convert 0/1 to True/False

        return jsonify({"Irrigation Required": irrigation_required})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
