// ============================================================
// Citizen Feedback Hook
// ------------------------------------------------------------
// Lets citizens mark a prediction as Correct (👍) or Wrong (👎).
// Stored locally (localStorage) — simulates a citizen-in-the-loop
// active learning dataset that could later be used to retrain
// the model. NOVEL contribution for the research paper.
// ============================================================

import { useEffect, useState } from "react";

const STORAGE_KEY = "cleancity_feedback";

type FeedbackMap = Record<string, "up" | "down">;

function readAll(): FeedbackMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(data: FeedbackMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("feedback-updated"));
}

export function useFeedback(reportId: string) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const sync = () => setVote(readAll()[reportId] ?? null);
    sync();
    window.addEventListener("feedback-updated", sync);
    return () => window.removeEventListener("feedback-updated", sync);
  }, [reportId]);

  const submit = (newVote: "up" | "down") => {
    const all = readAll();
    if (all[reportId] === newVote) {
      delete all[reportId];
    } else {
      all[reportId] = newVote;
    }
    writeAll(all);
  };

  return { vote, submit };
}

export function useFeedbackStats() {
  const [stats, setStats] = useState({ up: 0, down: 0, total: 0 });

  useEffect(() => {
    const sync = () => {
      const all = readAll();
      const values = Object.values(all);
      setStats({
        up: values.filter((v) => v === "up").length,
        down: values.filter((v) => v === "down").length,
        total: values.length,
      });
    };
    sync();
    window.addEventListener("feedback-updated", sync);
    return () => window.removeEventListener("feedback-updated", sync);
  }, []);

  return stats;
}
