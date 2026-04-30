# ai-garbage-monitoring-system
# AI-Powered Garbage Detection & Monitoring System

## Overview
This project is a web-based system that detects garbage in images using AI and helps monitor urban cleanliness through a centralized dashboard.

## Features
- Image upload for garbage reporting
- AI-based garbage detection (CNN - MobileNetV2)
- Confidence score prediction
- Location-based reporting (GPS)
- Interactive dashboard for monitoring
- Status tracking (Pending / Cleaned)

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Supabase (PostgreSQL, Storage)
- AI/ML: TensorFlow.js, MobileNetV2
- Maps: Geolocation API

## Dataset
- TrashNet Dataset (2527 images)
- Classes: Plastic, Paper, Metal, Glass, Cardboard, Trash

## How It Works
1. User uploads an image  
2. Location is captured  
3. AI model analyzes image  
4. Garbage is detected with confidence score  
5. Data stored in database  
6. Displayed on dashboard  

## Results
- Accuracy: ~85%
- Successfully detects garbage in real-world images

## Author
Suhil Prasanth
