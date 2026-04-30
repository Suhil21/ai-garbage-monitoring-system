# Project Documentation

Supporting files for the **CleanCity AI** mini project. These files are
used both inside the app (Model Info page) and as reference material for
the project report.

## Contents

| File                    | Description                                              |
|-------------------------|----------------------------------------------------------|
| `algorithm.md`          | Step-by-step explanation of the algorithms used          |
| `model_explanation.txt` | Plain-English description of how the model works         |
| `dataset_info.md`       | Details about TrashNet & TACO datasets                   |
| `prediction_sample.json`| Example output of the hybrid classifier                  |

## How it fits together

```
        Image Upload (User)
               │
               ▼
   ┌───────────────────────────┐
   │  MobileNetV2 (Browser)    │  ← CNN, Transfer Learning
   └────────────┬──────────────┘
                │ cnn_score (0..1)
                ▼
   ┌───────────────────────────┐
   │  Gemini Vision (Server)   │  ← Vision Transformer
   └────────────┬──────────────┘
                │ gemini_score (0..1)
                ▼
   ┌───────────────────────────┐
   │  Ensemble (weighted)      │
   │  0.35*CNN + 0.65*Gemini   │
   └────────────┬──────────────┘
                │ final_score
                ▼
        ≥ 0.40  → Pending Cleanup
        <  0.40  → No Cleanup Required
```
