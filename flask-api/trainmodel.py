import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, GroupShuffleSplit
import joblib

# Load the dataset
data = pd.read_csv("C:/Users/Saparya/OneDrive/Desktop/Jalsavardhn/flask-api/lineardata.csv")

# Define features and target column
features = ["SOIL TYPE", "REGION", "TEMPERATURE", "WEATHER CONDITION"]  # <-- Replace with actual feature names
x = data[features]
y = data["WATER REQUIREMENT"]  # <-- Replace with actual target column name

# Split into training and testing sets
spliter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_index, test_index = next(spliter.split(x, y, data["CROP TYPE"]))

train_x, test_x = x.iloc[train_index], x.iloc[test_index]
train_y, test_y = y.iloc[train_index], y.iloc[test_index]

# Apply log transformation to train_y
train_y = np.log1p(train_y)

# Convert categorical features to one-hot encoding
x_train = pd.get_dummies(train_x)
x_test = pd.get_dummies(test_x)

# Align columns to handle missing categories
x_train, x_test = x_train.align(x_test, join='left', axis=1, fill_value=0)

# Initialize and train the model
model = LinearRegression()
model.fit(x_train, train_y)

# Make predictions and apply inverse log transformation
predictions = model.predict(x_test)
predictions = np.expm1(predictions)  # Convert back to original scale

# Evaluate performance using RMSE
rmse = np.sqrt(mean_squared_error(test_y, predictions))

print("Predictions:", predictions)
print("Root Mean Squared Error (RMSE):", rmse)

joblib.dump(model, "linear.pkl")