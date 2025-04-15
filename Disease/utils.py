import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image

# Load model and class labels
MODEL_PATH = os.path.join("model", "disease_model.h5")
CLASS_INDEX_PATH = os.path.join("model", "class_indices.json")

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_INDEX_PATH, "r") as f:
    class_indices = json.load(f)

CLASS_NAMES = [k for k, v in sorted(class_indices.items(), key=lambda item: item[1])]

def get_pesticide_info(disease):
    pesticides = {
        "Pepper__bell___Bacterial_spot": "Use copper-based fungicides like Copper Oxychloride or Streptomycin.",
        "Pepper__bell___healthy": "No disease detected.",
        "Potato___Early_blight": "Use fungicides like Chlorothalonil or Mancozeb.",
        "Potato___Late_blight": "Use systemic fungicides like Dimethomorph or Fluazinam.",
        "Potato___healthy": "No disease detected.",
        "Tomato___Bacterial_spot": "Spray Copper Hydroxide or Streptomycin sulfate.",
        "Tomato___Early_blight": "Use Chlorothalonil or Mancozeb weekly.",
        "Tomato___Late_blight": "Apply systemic fungicides like Metalaxyl or Cymoxanil.",
        "Tomato___Leaf_Mold": "Spray Mancozeb or improve airflow to reduce humidity.",
        "Tomato___Septoria_leaf_spot": "Use Thiophanate-methyl or Chlorothalonil.",
        "Tomato___Spider_mites_Two_spotted_spider_mite": "Use Abamectin or insecticidal soap.",
        "Tomato___Target_Spot": "Use Copper-based fungicides or Chlorothalonil.",
        "Tomato___Tomato_YellowLeaf__Curl_Virus": "Control whiteflies, remove infected plants.",
        "Tomato___Tomato_mosaic_virus": "Disinfect tools, control aphids, and remove infected plants.",
        "Tomato___healthy": "No disease detected."
    }
    return pesticides.get(disease, "No data available.")

def predict_image(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        preds = model.predict(img)
        print("Predictions:", preds)
        print("Prediction shape:", preds.shape)

        if preds.shape[1] != len(CLASS_NAMES):
            return "Prediction error", "Prediction failed. CLASS_NAMES mismatch."

        pred_class = CLASS_NAMES[np.argmax(preds[0])]
        pesticide = get_pesticide_info(pred_class)

        return pred_class, pesticide

    except Exception as e:
        return "Error", str(e)
