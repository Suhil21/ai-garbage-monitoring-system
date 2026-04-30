import type { GarbageReport } from "@/lib/types";

export const CLEANUP_THRESHOLD = 0.4;

export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  if (typeof value === "number") return value > 0;
  return false;
}

export function clampUnit(value: unknown, fallback = 0): number {
  const normalized = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(normalized)) return fallback;

  return Math.min(1, Math.max(0, normalized));
}

export function getGarbageLevelFromAiResult(result: {
  detected?: unknown;
  garbage_level?: unknown;
  confidence?: unknown;
} | null | undefined): number {
  if (result?.garbage_level !== undefined && result?.garbage_level !== null) {
    return clampUnit(result.garbage_level);
  }

  return parseBoolean(result?.detected) ? clampUnit(result?.confidence) : 0;
}

export function getGarbageLevelFromStoredValues(detected: unknown, value: unknown): number {
  return parseBoolean(detected) ? clampUnit(value) : 0;
}

export function getDerivedReportStatus(status: string, detected: unknown, value: unknown): string {
  if (status === "Cleaned" || status === "Action Taken") return status;

  return getGarbageLevelFromStoredValues(detected, value) >= CLEANUP_THRESHOLD
    ? "Pending"
    : "No Cleanup Required";
}

export function normalizeReport(report: GarbageReport): GarbageReport {
  const detected = parseBoolean(report.detected);
  const confidence = getGarbageLevelFromStoredValues(detected, report.confidence);

  return {
    ...report,
    detected,
    confidence,
    status: getDerivedReportStatus(report.status, detected, confidence),
  };
}