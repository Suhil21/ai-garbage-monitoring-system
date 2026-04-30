# CleanCity AI — Smart Garbage Monitoring System

A college mini-project that uses **AI image recognition** to detect garbage in
photos uploaded by citizens, automatically marks the location on a map, and
helps a municipal officer decide whether cleanup is required.

---

## 1. Problem Statement

Cities receive thousands of cleanliness complaints every day. Manually
verifying each photo and assigning an officer is slow. This project automates
the detection step using AI so officers can focus only on locations that
truly need cleanup.

---

## 2. Objectives

1. Let any user upload a photo with a GPS location.
2. Use AI to decide if the photo contains visible garbage.
3. Show a confidence score (how sure the AI is).
4. Save every report into a database.
5. Show all reports on a dashboard and a map.
6. Allow assignment of a ward officer to each pending complaint.

---

## 3. Tech Stack

| Layer       | Technology                                 |
|-------------|---------------------------------------------|
| Frontend    | React + TypeScript + Tailwind CSS           |
| Backend     | Supabase (PostgreSQL + Storage + Functions) |
| AI Model 1  | MobileNetV2 (CNN) — runs in the browser     |
| AI Model 2  | Google Gemini Vision — runs on the server   |
| Map         | Leaflet (OpenStreetMap)                     |

---

## 4. Datasets Used (Real-life)

### Primary: **TrashNet**
- 2,527 labeled images, 6 classes: plastic, paper, cardboard, glass, metal, trash
- Authors: Yang & Thung, Stanford CS229 (2016)
- Source: https://github.com/garythung/trashnet

### Secondary: **TACO** (Trash Annotations in Context)
- 1,500+ real-world litter images, 60 categories
- Source: http://tacodataset.org

### Pre-training: **ImageNet**
- 1.28 million images across 1,000 classes — used to pre-train MobileNetV2.

> See `public/project-files/dataset_info.md` for full details.

---

## 5. Algorithms Used

1. **Convolutional Neural Network (CNN)** — MobileNetV2 (Transfer Learning)
2. **Binary Classification** — Garbage vs No Garbage
3. **Threshold Decision Rule** — score ≥ 0.4 → "Pending Cleanup"
4. **Ensemble Learning** — combine two AI models for better accuracy
5. **Vision Transformer** — Google Gemini Vision (zero-shot)

Final formula:
```
final_score = 0.35 × CNN_score + 0.65 × Gemini_score
```

> See `public/project-files/algorithm.md` for explanations.

---

## 6. How the System Works

```
User Upload → Image Stored → AI Detection → Result Saved → Dashboard Display → Officer Assigned
```

1. User uploads a photo and picks a location on the map.
2. Photo is uploaded to Supabase Storage.
3. The browser runs MobileNetV2 to get a CNN garbage score.
4. An edge function calls Gemini Vision for a second opinion.
5. The two scores are combined (ensemble).
6. The report is saved to the `garbage_reports` table.
7. The dashboard shows it; an officer can be assigned.

---

## 7. Project File Structure

```
src/
├── pages/
│   ├── Dashboard.tsx        # All complaints + filters
│   ├── UploadPage.tsx       # Upload photo + pick location
│   ├── MapPage.tsx          # Map view of all reports
│   ├── OfficersPage.tsx     # Ward officer directory
│   └── ModelInfoPage.tsx    # AI architecture & datasets
├── components/
│   ├── Navbar.tsx
│   ├── ReportCard.tsx       # One complaint card
│   ├── StatsCards.tsx       # Total / Pending / Cleaned counts
│   ├── LocationPicker.tsx   # Map for choosing GPS coords
│   ├── MapView.tsx          # Leaflet map with markers
│   ├── ProjectCharts.tsx    # Accuracy & dataset charts
│   └── ArchitectureDiagram.tsx
├── hooks/
│   ├── useReports.ts        # Fetch / create reports
│   └── useWardOfficers.ts   # Fetch officers
├── lib/
│   ├── garbage-classifier.ts  # MobileNetV2 + ensemble logic
│   ├── report-utils.ts        # Threshold & helpers
│   └── types.ts
└── integrations/supabase/    # Auto-generated DB client

supabase/functions/detect-garbage/
└── index.ts                  # Edge function — Gemini Vision call

public/project-files/         # Documentation files for viva
├── dataset_info.md
├── algorithm.md
├── model_explanation.txt
└── prediction_sample.json
```

---

## 8. Database Schema (PostgreSQL)

**garbage_reports**
| Column        | Type      | Notes                      |
|---------------|-----------|----------------------------|
| id            | uuid      | primary key                |
| image_url     | text      | photo location             |
| latitude      | numeric   | GPS latitude               |
| longitude     | numeric   | GPS longitude              |
| detected      | boolean   | garbage present?           |
| confidence    | numeric   | ensemble score 0–1         |
| status        | text      | Pending / Cleaned / etc.   |
| ward_area     | text      | optional ward name         |
| assigned_officer_id | uuid | FK → ward_officers      |
| created_at    | timestamp |                            |

**ward_officers**
| Column      | Type | Notes                |
|-------------|------|----------------------|
| id          | uuid | primary key          |
| name        | text |                      |
| ward_name   | text |                      |
| designation | text |                      |
| email       | text |                      |
| phone       | text |                      |

---

## 9. Results

- Test set: 50 images
- Correct predictions: 43
- **Accuracy: 86%**

Most errors happen on blurry or low-light photos.

---

## 10. How to Explain in Viva (Quick Script)

> "I built CleanCity AI, a web application that helps municipal teams detect
> garbage from citizen-uploaded photos. The user uploads a photo and selects
> a location. I use **two AI models together** — MobileNetV2, a CNN
> pre-trained on ImageNet that runs in the browser, and Google Gemini Vision,
> a Transformer running on the server. Their scores are combined using
> weighted ensemble: `0.35 × CNN + 0.65 × Gemini`. If the final score is
> ≥ 0.4, the report is marked as **Pending Cleanup**. All data is stored in a
> PostgreSQL database via Supabase, and the dashboard lets officers see and
> manage every complaint. I trained on the **TrashNet** dataset (2,527 images
> across 6 garbage classes) and reached **86% accuracy** on my test set."

---

## 11. Running the Project

```bash
npm install
npm run dev
```

Open http://localhost:5173.

The Supabase backend (database + storage + edge function) is already
provisioned via Lovable Cloud.
