// ============================================================
// Hotspot Detection (simple grid-based clustering)
// ------------------------------------------------------------
// Inspired by DBSCAN, but simplified for easy explanation.
//
// Idea:
//  1. Round each report's (lat, lng) to a small grid cell (~110m).
//  2. Count how many reports fall in each cell.
//  3. If a cell has >= MIN_REPORTS, mark it as a "hotspot".
//
// This identifies areas where garbage is repeatedly reported,
// which is a NOVEL contribution over showing plain pins.
// ============================================================

import type { GarbageReport } from "./types";

// ~0.001 degrees ≈ 110 meters
const GRID_SIZE = 0.001;
const MIN_REPORTS = 2;

export interface Hotspot {
  latitude: number;
  longitude: number;
  count: number;
  pendingCount: number;
}

export function findHotspots(reports: GarbageReport[]): Hotspot[] {
  const buckets = new Map<string, GarbageReport[]>();

  for (const r of reports) {
    const latKey = Math.round(r.latitude / GRID_SIZE) * GRID_SIZE;
    const lngKey = Math.round(r.longitude / GRID_SIZE) * GRID_SIZE;
    const key = `${latKey.toFixed(4)},${lngKey.toFixed(4)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r);
  }

  const hotspots: Hotspot[] = [];
  buckets.forEach((group) => {
    if (group.length >= MIN_REPORTS) {
      const avgLat = group.reduce((s, r) => s + r.latitude, 0) / group.length;
      const avgLng = group.reduce((s, r) => s + r.longitude, 0) / group.length;
      hotspots.push({
        latitude: avgLat,
        longitude: avgLng,
        count: group.length,
        pendingCount: group.filter((r) => r.status === "Pending").length,
      });
    }
  });

  return hotspots.sort((a, b) => b.count - a.count);
}
