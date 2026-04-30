const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function clampUnit(value: unknown, fallback = 0): number {
  const normalized = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(normalized)) return fallback;

  return Math.min(1, Math.max(0, normalized));
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  if (typeof value === "number") return value > 0;
  return false;
}

function extractJsonPayload(content: unknown) {
  if (typeof content !== "string") return null;

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end <= start) return null;

  return JSON.parse(content.slice(start, end + 1));
}

function normalizeResult(raw: unknown) {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  const garbageLevel = clampUnit((parsed as Record<string, unknown> | null)?.garbage_level);
  const detected = parseBoolean((parsed as Record<string, unknown> | null)?.detected) || garbageLevel > 0;
  const confidence = clampUnit((parsed as Record<string, unknown> | null)?.confidence, 0.5);
  const description = typeof (parsed as Record<string, unknown> | null)?.description === "string"
    ? ((parsed as Record<string, unknown>).description as string).trim()
    : "Image analyzed for visible garbage.";

  return {
    detected,
    garbage_level: detected ? garbageLevel : 0,
    confidence,
    description,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Lovable AI is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { image_url } = await req.json();

    if (!image_url || typeof image_url !== "string") {
      return new Response(
        JSON.stringify({ error: "image_url is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You inspect civic cleanliness photos. Detect only visible garbage, litter, trash, dumped waste, debris piles, or overflowing bins with trash spilling outside. Do not count clean roads, buildings, people, shadows, soil, leaves, or normal street objects as garbage. Return garbage_level as a number from 0 to 1 where 0 means no visible garbage, 0.1 means a tiny trace, 0.4 means enough visible garbage to justify cleanup, and 1 means the scene is dominated by garbage. If garbage is not clearly visible, set detected to false and garbage_level to 0. Confidence must reflect how sure you are about the assessment, not how much garbage exists.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and estimate the visible garbage level.",
              },
              {
                type: "image_url",
                image_url: { url: image_url },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_garbage",
              description: "Classify whether visible garbage is present and estimate its severity.",
              parameters: {
                type: "object",
                properties: {
                  detected: { type: "boolean" },
                  garbage_level: { type: "number", minimum: 0, maximum: 1 },
                  confidence: { type: "number", minimum: 0, maximum: 1 },
                  description: { type: "string" },
                },
                required: ["detected", "garbage_level", "confidence", "description"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "classify_garbage" },
        },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);

      if (response.status === 429 || response.status === 402) {
        return new Response(errText, {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ error: "AI analysis failed", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === "length" || finishReason === "max_tokens") {
      return new Response(
        JSON.stringify({ error: "AI response was truncated. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const toolArguments = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const fallbackContent = data.choices?.[0]?.message?.content;

    if (!toolArguments && !fallbackContent) {
      console.error("Could not parse AI response:", data);
      return new Response(
        JSON.stringify({ error: "Could not analyze image" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = normalizeResult(toolArguments ?? extractJsonPayload(fallbackContent));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
