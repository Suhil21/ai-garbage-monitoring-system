import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GarbageReport } from "@/lib/types";
import { findHotspots } from "@/lib/hotspots";

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapViewComponent({ reports }: { reports: GarbageReport[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = reports.length > 0
      ? [reports[0].latitude, reports[0].longitude]
      : [20.5937, 78.9629];

    const map = L.map(containerRef.current).setView(center, 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers and hotspot circles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Draw hotspot circles (areas with repeated complaints)
    const hotspots = findHotspots(reports);
    hotspots.forEach((h) => {
      L.circle([h.latitude, h.longitude], {
        radius: 150,
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.25,
        weight: 2,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:0.8rem;">
            <b style="color:#b45309;">⚠ Hotspot Area</b><br/>
            ${h.count} reports (${h.pendingCount} pending)
          </div>`
        );
    });

    reports.forEach((r) => {
      const marker = L.marker([r.latitude, r.longitude], {
        icon: r.status === "Pending" ? redIcon : greenIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="width:12rem;">
          <img src="${r.image_url}" alt="Report" style="width:100%;border-radius:0.25rem;" />
          <div style="margin-top:0.5rem;font-weight:600;color:${r.status === "Pending" ? "#ef4444" : "#22c55e"}">
            ${r.status}
          </div>
          <p style="font-size:0.75rem;margin-top:0.25rem;">
            ${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}
          </p>
          <p style="font-size:0.75rem;">${new Date(r.created_at).toLocaleString()}</p>
        </div>
      `);
    });
  }, [reports]);

  return (
    <div className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden border animate-fade-in">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
