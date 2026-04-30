# Dataset Information

## Primary Dataset: TrashNet

- **Total Images:** 2527
- **Number of Classes:** 6
- **Classes:**
  1. plastic
  2. paper
  3. metal
  4. glass
  5. cardboard
  6. trash
- **Authors:** Yang & Thung (Stanford CS229, 2016)
- **Source:** https://github.com/garythung/trashnet

## Why TrashNet?

TrashNet is a clean, labeled dataset of common waste items photographed
on a white background. It is widely used in academic mini-projects on
garbage / waste classification because:

- The labels are well-defined (6 simple classes).
- The dataset size (~2.5K images) is small enough to train on a laptop.
- It pairs well with Transfer Learning from ImageNet.

## How We Use It in This Project

- The 6 TrashNet classes are mapped to a binary label:
  **Garbage** vs **No Garbage**.
- Our CNN (MobileNetV2) is pre-trained on ImageNet and uses
  garbage-related ImageNet classes (bottle, can, plastic bag, carton,
  etc.) as proxy features for the TrashNet categories.
- A second model (Gemini Vision) gives a zero-shot opinion on the same
  image, and the two scores are combined (ensemble) for the final
  decision.

## Secondary Reference: TACO

- **Full name:** Trash Annotations in Context
- **Size:** 1500+ images, 4784 annotations across 60 categories
- **Source:** http://tacodataset.org
- **Use:** Inspiration for real-world litter understanding (litter on
  streets, parks, beaches) — used as a reference, not for training.
