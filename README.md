# AI-Powered Garbage Detection and Monitoring System

## Overview

This project presents a web-based application designed to detect garbage in images using artificial intelligence and assist in monitoring urban cleanliness. The system allows users to upload images of waste in public areas, automatically analyzes them using a trained model, and displays the results on a centralized dashboard.

The goal of this project is to demonstrate how computer vision and web technologies can be combined to address real-world civic issues such as improper waste disposal.

---

## Objectives

- To build an automated system for detecting garbage in images  
- To provide a platform for reporting and monitoring waste in public areas  
- To apply machine learning techniques for image classification  
- To create an interactive dashboard for managing reported cases  

---

## Features

- Image upload functionality for reporting garbage  
- AI-based classification using a Convolutional Neural Network (MobileNetV2)  
- Confidence score indicating prediction accuracy  
- Location-based reporting using geolocation  
- Dashboard interface to view and manage reports  
- Status tracking (e.g., Pending, Cleaned)  

---

## System Architecture

The system follows a simple end-to-end flow:

1. The user uploads an image through the web interface  
2. The system captures the user’s location (if enabled)  
3. The image is processed using the trained model  
4. The model predicts whether garbage is present  
5. The result, along with metadata, is stored in the database  
6. The dashboard displays all reports for monitoring and management  

---

## Technologies Used

### Frontend
- React.js  
- Tailwind CSS  

### Backend
- Supabase (PostgreSQL database and storage)  

### Machine Learning
- TensorFlow.js  
- MobileNetV2 (pre-trained Convolutional Neural Network)  

### Additional Tools
- Geolocation API for location tracking  

---

## Dataset

The model is based on real-world waste classification datasets.

**Primary Dataset: TrashNet**
- Total Images: 2527  
- Categories:
  - Plastic  
  - Paper  
  - Metal  
  - Glass  
  - Cardboard  
  - Trash  

The dataset contains labeled images of different types of waste and is commonly used for training classification models in waste management applications.

---

## Algorithm and Approach

### Convolutional Neural Network (CNN)

The system uses MobileNetV2, a lightweight CNN architecture suitable for real-time image classification. It is pre-trained on ImageNet and adapted for identifying garbage-related patterns.

### Classification

The model performs binary classification:
- Garbage  
- No Garbage  

### Prediction Logic

- The uploaded image is converted into numerical pixel data  
- The CNN extracts features such as shape, texture, and edges  
- The model outputs a prediction along with a confidence score  
- A threshold is used to determine the final classification  

---

## Results

- Approximate Accuracy: 80–90% (based on test samples)  
- The system performs well on clear and well-lit images  
- Accuracy may vary for complex backgrounds or unclear images  

---

## How to Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ai-garbage-monitoring-system.git
## Author
Suhil Prasanth
