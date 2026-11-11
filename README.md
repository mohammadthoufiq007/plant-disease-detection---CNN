# 🌿 Plant Disease Detection CNN

A Convolutional Neural Network (CNN) deep learning web application to classify leaf images into 39 different categories (healthy and diseased states) using PyTorch and Flask.

## 🚀 Features
- **Convolutional Neural Network (CNN)** built with PyTorch with 4 convolutional blocks + batch normalization + max pooling.
- **Instant Live Leaf Image Preview** upon file selection or camera snapshot before submitting for analysis.
- **Disease Diagnosis & Prevention**: Provides disease diagnosis, condition description, and actionable preventive measures.
- **39 Classes Supported**: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.

---

## 💻 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/mohammadthoufiq007/plant-disease-detection---CNN.git
cd plant-disease-detection---CNN
```

### 2. Install Dependencies
```bash
pip install -r "Flask Deployed App/requirements.txt"
```

### 3. Model Weights
1. Download the pre-trained weights file (`plant_disease_model_1_latest.pt`) from [Google Drive](https://drive.google.com/drive/folders/1ewJWAiduGuld_9oGSrTuLumg9y62qS6A?usp=share_link).
2. Place `plant_disease_model_1_latest.pt` inside the `Flask Deployed App/` folder.

### 4. Start the Web App
```bash
cd "Flask Deployed App"
python app.py
```
Open your browser and navigate to: **http://localhost:5000**

---

## 📁 Project Structure
```
├── Flask Deployed App/
│   ├── app.py                     # Flask backend & inference route
│   ├── CNN.py                     # PyTorch CNN model architecture
│   ├── disease_info.csv           # Descriptions & prevention measures
│   ├── requirements.txt           # Python dependencies
│   ├── Procfile                   # Cloud deployment config
│   ├── static/                    # Uploads & assets
│   └── templates/
│       ├── base.html              # Base layout
│       ├── index.html             # Upload page with live preview
│       └── submit.html            # Diagnosis results & guidance
├── Model/
│   ├── Plant Disease Detection Code.ipynb
│   └── model.JPG
├── test_images/                   # Sample leaf photos for testing
└── README.md
```
