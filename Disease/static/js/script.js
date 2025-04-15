const form = document.getElementById('upload-form');
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || 'Error occurred!');
        return;
    }

    document.getElementById('preview').src = result.image;
    document.getElementById('disease').textContent = result.disease;
    document.getElementById('confidence').textContent = result.confidence;
    document.getElementById('pesticide').textContent = result.pesticide;
    document.getElementById('result').classList.remove('hidden');
});
