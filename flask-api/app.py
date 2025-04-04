from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the encoder and model
encoder = joblib.load("label_encoder.pkl")  # Load LabelEncoder
model = joblib.load("logistic_model.pkl")  # Load trained model

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Convert JSON to Pandas DataFrame
        input_data = pd.DataFrame([data])

        # Debugging: Print original input data
        print("\n🟢 Original Input Data:\n", input_data)

        # Define categorical and numerical columns
        categorical_cols = ["cropType"]  # Example categorical column
        numerical_cols = ["cropDays", "temperature", "humidity", "soilMoisture"]  # Numerical columns

        # Encode categorical features using LabelEncoder (for single categorical feature)
        input_data["cropType"] = encoder.transform(input_data["cropType"])

        # Create final input with both categorical and numerical data
        final_input = input_data[numerical_cols + categorical_cols]

        # Align features with the model's expected features
        final_input = final_input.reindex(columns=model.feature_names_in_, fill_value=0)

        # Convert DataFrame to NumPy array and reshape correctly
        input_array = final_input.to_numpy().reshape(1, -1)

        # Debugging: Print input shape
        print("\n✅ Processed Input Shape:", input_array.shape)
        print("\n✅ Model Expected Features:", model.feature_names_in_)

        # Make prediction
        prediction = model.predict(input_array)

        # Convert prediction result to boolean
        irrigation_required = bool(prediction[0])

        return jsonify({"Irrigation Required": irrigation_required})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
