import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Locate } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Props {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, onLocationChange }: Props) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const detectLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([latitude, longitude], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([latitude, longitude]).addTo(map);
    markerRef.current = marker;

    map.on("click", (e: L.LeafletMouseEvent) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    // Auto-detect on mount
    detectLocation();

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker & view when coords change
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([latitude, longitude]);
    mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
  }, [latitude, longitude]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Location</Label>
        <Button type="button" variant="outline" size="sm" onClick={detectLocation} disabled={loading}>
          <Locate className="mr-1 h-4 w-4" />
          {loading ? "Detecting..." : "Auto-detect"}
        </Button>
      </div>

      <div className="h-[250px] rounded-lg overflow-hidden border">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => onLocationChange(Number(e.target.value), longitude)}
          />
        </div>
        <div>
          <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => onLocationChange(latitude, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
