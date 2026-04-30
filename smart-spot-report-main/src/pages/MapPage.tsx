import { useReports } from "@/hooks/useReports";
import MapViewComponent from "@/components/MapView";
import { Loader2 } from "lucide-react";

export default function MapPage() {
  const { data: reports, isLoading } = useReports();

  return (
    <div className="container py-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-destructive mr-1 align-middle" /> Pending
          <span className="inline-block w-3 h-3 rounded-full bg-success ml-3 mr-1 align-middle" /> Cleaned
          <span className="inline-block w-3 h-3 rounded-full bg-warning ml-3 mr-1 align-middle" /> Hotspot Area
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hotspots are auto-detected zones with 2+ reports nearby (grid-based clustering).
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <MapViewComponent reports={reports ?? []} />
      )}
    </div>
  );
}
