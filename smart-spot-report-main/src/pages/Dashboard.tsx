import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useWardOfficers } from "@/hooks/useWardOfficers";
import ReportCard from "@/components/ReportCard";
import StatsCards from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, FileText } from "lucide-react";

const FILTERS = ["All", "Pending", "Action Taken", "Cleaned", "No Cleanup Required"] as const;

export default function Dashboard() {
  const { data: reports, isLoading } = useReports();
  const { data: officers } = useWardOfficers();
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");

  const filtered = reports?.filter(
    (r) => filter === "All" || r.status === filter
  ) ?? [];

  return (
    <div className="container py-8 space-y-8">
      {/* Government header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Municipal Garbage Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            CleanCity AI — Real-time garbage detection & ward officer assignment system
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <StatsCards reports={reports ?? []} />

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((s) => (
              <Button
                key={s}
                variant={filter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm">Upload a garbage image to file a new complaint</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <ReportCard key={r.id} report={r} officers={officers ?? []} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
