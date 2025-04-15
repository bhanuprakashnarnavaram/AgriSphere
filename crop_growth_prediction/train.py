import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

# Load merged data
df = pd.read_csv("data/merged_data.csv")

print("Initial columns:", df.columns.tolist())

# Replace '..' with NaN, then drop rows with missing values
df.replace('..', pd.NA, inplace=True)
df.dropna(inplace=True)

# Convert all numeric columns to float
df['average_rain_fall_mm_per_year'] = df['average_rain_fall_mm_per_year'].astype(float)
df['Avg_temp'] = df['Avg_temp'].astype(float)
df['Value_x'] = df['Value_x'].astype(float)

# Encode crop names from yield.csv
df['Item'] = LabelEncoder().fit_transform(df['Item_x'])

# Features and target
X = df[['average_rain_fall_mm_per_year', 'Avg_temp', 'Item']]
y = df['Value_x']  # Yield

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save model and features
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("features.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)

print("✅ Model trained and saved successfully!")
