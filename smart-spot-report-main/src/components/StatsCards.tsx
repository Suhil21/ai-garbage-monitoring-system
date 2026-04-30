import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, CheckCircle, UserCheck, BarChart3 } from "lucide-react";
import type { GarbageReport } from "@/lib/types";

export default function StatsCards({ reports }: { reports: GarbageReport[] }) {
  const total = reports.length;
  const pending = reports.filter((r) => r.status === "Pending").length;
  const actionTaken = reports.filter((r) => r.status === "Action Taken").length;
  const cleaned = reports.filter((r) => r.status === "Cleaned").length;
  const avgGarbageLevel = total > 0
    ? Math.round((reports.reduce((s, r) => s + (r.confidence ?? 0), 0) / total) * 100)
    : 0;

  const stats = [
    { label: "Total Complaints", value: total, icon: FileText, color: "text-primary" },
    { label: "Pending Action", value: pending, icon: AlertTriangle, color: "text-destructive" },
    { label: "Action Taken", value: actionTaken, icon: UserCheck, color: "text-warning" },
    { label: "Resolved", value: cleaned, icon: CheckCircle, color: "text-success" },
    { label: "Avg Garbage Level", value: `${avgGarbageLevel}%`, icon: BarChart3, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <Card key={s.label} className="animate-fade-in">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-lg bg-accent p-3 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
