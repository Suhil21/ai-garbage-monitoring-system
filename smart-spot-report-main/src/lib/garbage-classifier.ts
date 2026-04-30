// Hybrid garbage classifier
// Algorithm: MobileNetV2 (CNN with Transfer Learning, pre-trained on ImageNet)
// Reference datasets: TrashNet (2527 images, 6 classes) + TACO (Trash Annotations in Context)
// Combined with Gemini Vision Transformer for ensemble prediction.

import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

// ImageNet class keywords that strongly correlate with TrashNet/TACO garbage classes
// (plastic, paper, cardboard, glass, metal, trash/litter)
const GARBAGE_KEYWORDS = [
  "plastic bag", "plastic", "bottle", "water bottle", "pop bottle", "wine bottle", "beer bottle",
  "paper", "carton", "cardboard", "packet", "envelope",
  "can", "tin", "beer can", "pop can", "soda can",
  "cup", "coffee mug", "paper towel", "tissue",
  "trash", "garbage", "ashcan", "bin", "dustbin",
  "wrapper", "wrapping", "packaging", "container",
  "broken", "debris", "rubble", "junk",
];

let modelPromise: Promise<mobilenet.MobileNet> | null = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return modelPromise;
}

export interface CnnPrediction {
  garbageScore: number; // 0..1
  topClass: string;
  topProbability: number;
  matchedClasses: { className: string; probability: number }[];
}

export async function classifyImage(imgEl: HTMLImageElement): Promise<CnnPrediction> {
  const model = await getModel();
  const predictions = await model.classify(imgEl, 10);

  const matched = predictions.filter((p) =>
    GARBAGE_KEYWORDS.some((kw) => p.className.toLowerCase().includes(kw))
  );

  const garbageScore = Math.min(
    1,
    matched.reduce((sum, p) => sum + p.probability, 0)
  );

  return {
    garbageScore,
    topClass: predictions[0]?.className ?? "unknown",
    topProbability: predictions[0]?.probability ?? 0,
    matchedClasses: matched.map((m) => ({ className: m.className, probability: m.probability })),
  };
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Ensemble: weighted average of CNN (MobileNetV2) + Vision Transformer (Gemini)
// Weights chosen to favor Gemini's higher accuracy while incorporating CNN evidence.
export function ensembleScore(cnnScore: number, geminiScore: number): number {
  const score = 0.35 * cnnScore + 0.65 * geminiScore;
  return Math.min(1, Math.max(0, score));
}
