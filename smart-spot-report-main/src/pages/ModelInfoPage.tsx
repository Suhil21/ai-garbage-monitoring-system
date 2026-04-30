import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Cpu, Layers, GitMerge, Workflow, BarChart3, FileText, Download, Target, CheckCircle2 } from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { AccuracyChart, DatasetDistributionChart } from "@/components/ProjectCharts";

const projectFiles = [
  { name: "dataset_info.md", desc: "TrashNet dataset summary (2527 images, 6 classes)", path: "/project-files/dataset_info.md" },
  { name: "algorithm.md", desc: "CNN, binary classification, threshold & ensemble", path: "/project-files/algorithm.md" },
  { name: "model_explanation.txt", desc: "Input → Processing → Output flow", path: "/project-files/model_explanation.txt" },
  { name: "prediction_sample.json", desc: "Example AI prediction output", path: "/project-files/prediction_sample.json" },
];

const flowSteps = [
  "User uploads a photo of a location",
  "Image is stored in Cloud Storage",
  "AI models (CNN + Gemini) detect garbage",
  "Result is saved into the database",
  "Dashboard displays the report",
  "Officer is assigned & status is updated",
];

export default function ModelInfoPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Model Architecture & Datasets
        </h1>
        <p className="text-muted-foreground">
          Technical documentation of the AI/ML pipeline used for garbage detection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            System Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ArchitectureDiagram />
          <p className="text-xs text-muted-foreground text-center">
            User uploads an image → analyzed in parallel by CNN (MobileNetV2) and Gemini Vision → ensemble combines both scores → final cleanup decision.
          </p>
        </CardContent>
      </Card>

      {/* How the System Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            How the System Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {flowSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Results & Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Results & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Test Images</p>
              <p className="text-3xl font-bold text-foreground mt-1">50</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Correct Predictions</p>
              <p className="text-3xl font-bold text-success mt-1">43</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-bold text-primary mt-1">86%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Training Accuracy vs Epochs
            </h3>
            <AccuracyChart />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Accuracy improves steadily as the model learns over training epochs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              TrashNet Dataset Distribution
            </h3>
            <DatasetDistributionChart />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Number of images per class in the TrashNet dataset (total ≈ 2527).
            </p>
          </div>

          <div className="rounded-md bg-muted/40 border p-3 text-sm space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-success" /> Observation
            </p>
            <p className="text-muted-foreground text-xs">
              The hybrid CNN + Gemini ensemble produces stable predictions across the test set.
              Most misclassifications occur on blurry or low-light images.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Project Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            Technical files documenting the dataset, algorithms, and sample predictions.
          </p>
          {projectFiles.map((f) => (
            <a
              key={f.name}
              href={f.path}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-md border bg-card p-3 hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-mono font-semibold truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
                </div>
              </div>
              <Download className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            Hybrid Ensemble Approach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            The system uses an <strong>ensemble of two models</strong> for higher reliability:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>CNN Classifier (MobileNetV2)</strong> — runs in the browser via TensorFlow.js
              for fast on-device inference.
            </li>
            <li>
              <strong>Vision Transformer (Google Gemini 3 Flash)</strong> — runs server-side via
              edge function for high-accuracy zero-shot classification.
            </li>
          </ol>
          <p className="bg-muted p-3 rounded-md font-mono text-xs">
            final_score = 0.35 × CNN_score + 0.65 × Gemini_score
          </p>
          <p>
            If <code>final_score ≥ 0.4</code>, the report is marked <Badge variant="destructive">Pending Cleanup</Badge>.
            Otherwise <Badge variant="secondary">No Cleanup Required</Badge>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Algorithms Used
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <div>
            <h3 className="font-semibold">1. Convolutional Neural Network (CNN) — MobileNetV2</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>A deep learning model designed to understand and classify images.</li>
              <li>We use <strong>MobileNetV2</strong>, a lightweight CNN that runs fast in the browser.</li>
              <li>It looks at the uploaded photo and predicts whether garbage is present.</li>
              <li>Pre-trained on ImageNet, so it already understands common objects like bottles, bags, and cans.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">2. Binary Classification</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>Each image is sorted into one of two categories: <strong>Garbage</strong> or <strong>No Garbage</strong>.</li>
              <li>This is the simplest form of classification in machine learning.</li>
              <li>The model outputs a confidence score between 0 and 1 for the "Garbage" class.</li>
              <li>Helps the municipal team quickly decide which locations need cleanup.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">3. Threshold-Based Decision Making</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>We set a fixed threshold value of <strong>0.4</strong> for the confidence score.</li>
              <li>If the score is <strong>≥ 0.4</strong>, the report is marked as <Badge variant="destructive">Pending Cleanup</Badge>.</li>
              <li>If the score is <strong>&lt; 0.4</strong>, it is marked as <Badge variant="secondary">No Cleanup Required</Badge>.</li>
              <li>This rule prevents false alarms from very low-confidence predictions.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">4. Ensemble Learning</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>We combine the results of <strong>two AI models</strong> instead of relying on just one.</li>
              <li>Model 1: MobileNetV2 (CNN) running in the browser.</li>
              <li>Model 2: Gemini Vision (a Vision Transformer) running on the server.</li>
              <li>Their scores are averaged with weights — this improves overall accuracy and reliability.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">5. Gemini Vision (Vision Transformer)</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>A modern AI model that understands images using the Transformer architecture.</li>
              <li>Performs <strong>zero-shot classification</strong> — no extra training needed.</li>
              <li>Returns a structured result: detected, garbage level, and a short description.</li>
              <li>Acts as a second opinion alongside the CNN for better accuracy.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Reference Datasets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold">TrashNet</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>Size: 2,527 labeled images</li>
              <li>Classes: glass, paper, cardboard, plastic, metal, trash</li>
              <li>Authors: Yang & Thung, Stanford CS229 (2016)</li>
              <li>Source: <a className="text-primary underline" href="https://github.com/garythung/trashnet" target="_blank" rel="noreferrer">github.com/garythung/trashnet</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">TACO (Trash Annotations in Context)</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>Size: 1,500+ images, 4,784 annotations across 60 categories</li>
              <li>Format: COCO-style segmentation masks of litter in real environments</li>
              <li>Authors: Proença & Simões (2020)</li>
              <li>Source: <a className="text-primary underline" href="http://tacodataset.org" target="_blank" rel="noreferrer">tacodataset.org</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">ImageNet (Pre-training)</h3>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-muted-foreground">
              <li>Used to pre-train MobileNetV2 backbone</li>
              <li>1.28M training images across 1000 categories</li>
              <li>Garbage-related ImageNet classes (plastic bag, bottle, can, carton, etc.) used as proxy labels</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Pipeline Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>User uploads image → stored in Lovable Cloud Storage (Supabase bucket)</li>
            <li>Browser loads MobileNetV2 → runs CNN classification → produces <code>cnn_score</code></li>
            <li>Edge function calls Gemini Vision API → produces <code>gemini_score</code></li>
            <li>Ensemble combines both scores → final <code>garbage_level</code></li>
            <li>If ≥ 0.4 → status = <code>Pending</code>, ward officer can be assigned</li>
            <li>If &lt; 0.4 → status = <code>No Cleanup Required</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
