import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCreateReport } from "@/hooks/useReports";
import { CLEANUP_THRESHOLD, getGarbageLevelFromAiResult, parseBoolean } from "@/lib/report-utils";
import { classifyImage, loadImage, ensembleScore } from "@/lib/garbage-classifier";
import LocationPicker from "@/components/LocationPicker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ImageIcon, Loader2, CheckCircle, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

// Convert any browser-decodable image (AVIF, HEIC on Safari, etc.) to a JPEG File via canvas.
async function convertToJpeg(file: File): Promise<File> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Browser cannot decode this image format"));
    i.src = dataUrl;
  });

  // Cap dimensions to keep upload size reasonable
  const MAX = 1600;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
  );
  if (!blob) throw new Error("Conversion failed");

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

export default function UploadPage() {
  const navigate = useNavigate();
  const createReport = useCreateReport();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [latitude, setLatitude] = useState(20.5937);
  const [longitude, setLongitude] = useState(78.9629);
  const [submitting, setSubmitting] = useState(false);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    let finalFile = f;
    const mime = f.type.toLowerCase();
    const needsConversion = !SUPPORTED_MIME.includes(mime);

    if (needsConversion) {
      setConverting(true);
      try {
        toast.info("Converting image…", { description: "Optimizing format for AI analysis." });
        finalFile = await convertToJpeg(f);
      } catch (err: any) {
        toast.error("Unsupported image", {
          description: err?.message || "Please try a PNG, JPEG, WebP or GIF.",
        });
        e.target.value = "";
        setConverting(false);
        return;
      }
      setConverting(false);
    }

    setFile(finalFile);
    setPreview(URL.createObjectURL(finalFile));
  }, []);

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please select an image"); return; }

    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("garbage-images")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("garbage-images")
        .getPublicUrl(path);

      const { data: aiResult, error: aiError } = await supabase.functions.invoke("detect-garbage", {
        body: { image_url: urlData.publicUrl },
      });

      if (aiError) throw aiError;

      let cnnScore = 0;
      try {
        const img = await loadImage(urlData.publicUrl);
        const cnn = await classifyImage(img);
        cnnScore = cnn.garbageScore;
        console.log("CNN prediction:", cnn);
      } catch (e) {
        console.warn("CNN classification skipped:", e);
      }

      const geminiScore = +getGarbageLevelFromAiResult(aiResult).toFixed(2);
      const garbageLevel = +ensembleScore(cnnScore, geminiScore).toFixed(2);
      const detected = parseBoolean(aiResult?.detected) || garbageLevel > 0;
      const needsCleanup = garbageLevel >= CLEANUP_THRESHOLD;

      await createReport.mutateAsync({
        image_url: urlData.publicUrl,
        latitude,
        longitude,
        detected,
        confidence: garbageLevel,
        status: needsCleanup ? "Pending" : "No Cleanup Required",
      });

      if (needsCleanup) {
        toast.warning("Cleanup required!", {
          description: `Visible garbage level is ${Math.round(garbageLevel * 100)}%. Marked for cleanup.`,
        });
      } else {
        toast.success("Report submitted — No cleanup needed", {
          description: garbageLevel > 0
            ? `Low garbage level (${Math.round(garbageLevel * 100)}%). No cleanup required.`
            : "No garbage detected in this image.",
        });
      }
      navigate("/");
    } catch (err: any) {
      toast.error("Failed to submit report", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || converting;

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-6 text-center animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
          <Sparkles className="h-3 w-3" />
          AI-Powered Detection
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Report Garbage</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Snap a photo and let our AI handle the rest
        </p>
      </div>

      <Card className="animate-fade-in shadow-lg border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            New Report
          </CardTitle>
          <CardDescription>
            Upload a clear photo of the location for accurate analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Photo</Label>
              <label className="group relative flex flex-col items-center justify-center h-56 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-accent/30 transition-all overflow-hidden">
                {converting ? (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Loader2 className="h-10 w-10 mb-2 animate-spin text-primary" />
                    <span className="text-sm font-medium">Converting image…</span>
                  </div>
                ) : preview ? (
                  <>
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(ev) => { ev.preventDefault(); clearFile(); }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 hover:bg-background shadow-sm transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                    <div className="p-3 rounded-full bg-accent/50 group-hover:bg-primary/10 mb-3 transition-colors">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-medium">Click to upload an image</span>
                    <span className="text-xs mt-1 text-muted-foreground">PNG, JPEG, WebP, GIF, AVIF or HEIC</span>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*,.heic,.heif,.avif"
                  className="hidden"
                  onChange={handleFile}
                  disabled={busy}
                />
              </label>
            </div>

            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
            />

            <Button type="submit" className="w-full h-11" disabled={busy || !file}>
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing & Submitting…</>
              ) : (
                <><CheckCircle className="mr-2 h-4 w-4" />Submit Report</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
