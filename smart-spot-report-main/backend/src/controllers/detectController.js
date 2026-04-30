/**
 * Detect controller — calls the Lovable AI Gateway (Gemini vision)
 * to classify garbage from an image URL. This mirrors the
 * supabase/functions/detect-garbage edge function but runs from
 * a manual Express backend.
 */
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function clamp01(v, fallback = 0) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

async function detectGarbage(req, res) {
  const { image_url } = req.body;
  if (!image_url) return res.status(400).json({ error: "image_url required" });

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
  }

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You inspect civic cleanliness photos. Detect only visible garbage. Return JSON: {detected:boolean, garbage_level:0-1, confidence:0-1, description:string}.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image for visible garbage." },
              { type: "image_url", image_url: { url: image_url } },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(502)
        .json({ error: "AI analysis failed", details: errText });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    const parsed =
      start >= 0 && end > start ? JSON.parse(content.slice(start, end + 1)) : {};

    res.json({
      detected: Boolean(parsed.detected) || clamp01(parsed.garbage_level) > 0,
      garbage_level: clamp01(parsed.garbage_level),
      confidence: clamp01(parsed.confidence, 0.5),
      description: parsed.description || "Image analyzed.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { detectGarbage };
