# Algorithms Used

## 1. Convolutional Neural Network (CNN) — MobileNetV2

- A deep learning model designed to understand and classify images.
- We use MobileNetV2, a lightweight CNN that runs fast in the browser
  via TensorFlow.js.
- It looks at the uploaded photo and predicts whether garbage is
  present.
- Pre-trained on ImageNet (1.28M images, 1000 classes), so it already
  recognizes common objects like bottles, bags, and cans.

## 2. Binary Classification

- Each image is sorted into one of two categories:
  **Garbage** or **No Garbage**.
- This is the simplest form of classification in machine learning.
- The model outputs a confidence score between 0 and 1 for the
  "Garbage" class.

## 3. Threshold-Based Decision Making

- We set a fixed threshold value of **0.4** for the confidence score.
- If score >= 0.4 → marked as "Pending Cleanup".
- If score <  0.4 → marked as "No Cleanup Required".
- This rule prevents false alarms from very low-confidence predictions.

## 4. Ensemble Learning

- We combine the results of TWO AI models instead of relying on one.
  - Model 1: MobileNetV2 (CNN) — runs in the browser.
  - Model 2: Gemini Vision (Vision Transformer) — runs on the server.
- The two scores are combined with weights:

      final_score = 0.35 * cnn_score + 0.65 * gemini_score

- This improves overall accuracy and reliability.

## 5. Gemini Vision (Vision Transformer)

- A modern AI model that understands images using the Transformer
  architecture.
- Performs zero-shot classification — no extra training needed.
- Returns a structured result: detected, garbage_level, confidence,
  description.
