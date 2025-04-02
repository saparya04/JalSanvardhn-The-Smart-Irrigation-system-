from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("linear.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_data = pd.DataFrame([data])
    input_dummy = pd.get_dummies(input_data)
    prediction = model.predict(input_dummy)[0]
    return jsonify({"Predicted Water Requirement": prediction})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
