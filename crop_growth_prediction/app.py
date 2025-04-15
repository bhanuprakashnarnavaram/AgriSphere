from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model and crop encoder
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("features.pkl", "rb") as f:
    crop_encoder = pickle.load(f)

# Get list of crop names
crop_names = list(crop_encoder.classes_)

# Pesticide suggestion dictionary
pesticide_info = {
    "Maize": {
        "name": "BASF Seltima Insecticide",
        "dose": "100 ml/acre",
        "link": "https://www.amazon.in/BASF-Seltima-Insecticide/dp/B0859PC95F"
    },
    "Potatoes": {
        "name": "Syngenta Actara Insecticide",
        "dose": "80 ml/acre",
        "link": "https://www.amazon.in/Syngenta-Actara-Insecticide-Thiamethoxam-Potato/dp/B0853JHRW7"
    },
    "Rice, paddy": {
        "name": "Bayer Folicur Fungicide",
        "dose": "120 ml/acre",
        "link": "https://www.amazon.in/Bayer-Folicur-Fungicide-Rice-Crops/dp/B08GSCP6N8"
    },
    "Sorghum": {
        "name": "Tata Rallis Tilt 250 Fungicide",
        "dose": "150 ml/acre",
        "link": "https://www.amazon.in/Rallis-Tilt-250-Fungicide-Sorghum/dp/B0859C4ZTW"
    },
    "Soybeans": {
        "name": "Dhanuka M-45 Fungicide",
        "dose": "100 ml/acre",
        "link": "https://www.amazon.in/Dhanuka-M-45-Fungicide-Soybean/dp/B08CYVZ8JL"
    }
}

@app.route("/")
def home():
    return render_template("index.html", crops=crop_names)

@app.route("/predict", methods=["POST"])
def predict():
    crop_name = request.form["crop"]
    rainfall = float(request.form["rainfall"])
    temp = float(request.form["temp"])

    crop_encoded = crop_encoder.transform([crop_name])[0]
    input_data = np.array([[rainfall, temp, crop_encoded]])

    prediction = model.predict(input_data)[0]
    prediction = round(prediction, 2)

    pesticide = pesticide_info.get(crop_name)

    return render_template(
        "index.html",
        crops=crop_names,
        result=f"🌾 Expected Yield for {crop_name} is {prediction} hg/ha",
        pesticide=pesticide,
        selected_crop=crop_name
    )

if __name__ == "__main__":
    app.run(debug=True)
