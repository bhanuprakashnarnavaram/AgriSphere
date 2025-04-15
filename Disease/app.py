from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
import uuid
from utils import predict_image

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join('static', 'images')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    pesticide = None
    image_url = None

    if request.method == 'POST':
        if 'file' not in request.files:
            return render_template('index.html', prediction="No file part")

        file = request.files['file']
        if file.filename == '':
            return render_template('index.html', prediction="No selected file")

        if file:
            filename = secure_filename(file.filename)
            unique_name = str(uuid.uuid4()) + "_" + filename
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
            file.save(image_path)
            pred_class, pesticide = predict_image(image_path)

            image_url = image_path  # to show in template
            prediction = pred_class

    return render_template('index.html', prediction=prediction, pesticide=pesticide, image=image_url)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
