import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, CheckCircle, AlertTriangle, UserCheck, Send, Phone, ThumbsUp, ThumbsDown } from "lucide-react";
import type { GarbageReport, WardOfficer } from "@/lib/types";
import { useUpdateStatus } from "@/hooks/useReports";
import { useFeedback } from "@/hooks/useFeedback";
import { toast } from "sonner";

interface Props {
  report: GarbageReport;
  officers: WardOfficer[];
}

export default function ReportCard({ report, officers }: Props) {
  const updateStatus = useUpdateStatus();
  const { vote, submit } = useFeedback(report.id);
  const [selectedOfficer, setSelectedOfficer] = useState<string>(report.assigned_officer_id ?? "");
  const isPending = report.status === "Pending";
  const isActionTaken = report.status === "Action Taken";
  const isCleaned = report.status === "Cleaned";
  const noCleanup = report.status === "No Cleanup Required";
  const confidencePct = Math.round((report.confidence ?? 0) * 100);

  const assignedOfficer = officers.find((o) => o.id === report.assigned_officer_id);

  const handleAssignAndNotify = () => {
    if (!selectedOfficer) {
      toast.error("Please select a ward officer");
      return;
    }
    const officer = officers.find((o) => o.id === selectedOfficer);
    updateStatus.mutate(
      { id: report.id, status: "Action Taken", assigned_officer_id: selectedOfficer, ward_area: officer?.ward_name ?? null },
      {
        onSuccess: () => {
          toast.success("Officer Notified!", {
            description: `${officer?.name} (${officer?.ward_name}) has been assigned and informed.`,
          });
        },
      }
    );
  };

  const statusConfig = {
    Pending: { variant: "destructive" as const, icon: AlertTriangle, className: "" },
    "Action Taken": { variant: "default" as const, icon: UserCheck, className: "bg-warning text-warning-foreground" },
    Cleaned: { variant: "default" as const, icon: CheckCircle, className: "bg-success text-success-foreground" },
    "No Cleanup Required": { variant: "secondary" as const, icon: CheckCircle, className: "" },
  };

  const config = statusConfig[report.status as keyof typeof statusConfig] ?? statusConfig.Pending;
  const StatusIcon = config.icon;
  const isGarbage = confidencePct >= 40;
  const predictionLabel = isGarbage ? "Garbage" : "No Garbage";

  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="aspect-video overflow-hidden bg-muted">
        <img src={report.image_url} alt="Garbage report" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={config.variant} className={config.className}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {report.status}
          </Badge>
          <Badge
            variant="outline"
            className={isGarbage ? "text-destructive border-destructive" : "text-success border-success"}
          >
            {predictionLabel}
          </Badge>
        </div>

        {/* Prediction details */}
        <div className="rounded-md border bg-muted/40 p-2.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Prediction</span>
            <span className={`font-semibold ${isGarbage ? "text-destructive" : "text-success"}`}>
              {predictionLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-mono font-semibold text-foreground">{confidencePct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${isGarbage ? "bg-destructive" : "bg-success"}`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="font-mono">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
        </div>

        {report.ward_area && (
          <div className="text-xs text-muted-foreground">
            📍 Area: <span className="font-medium text-foreground">{report.ward_area}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{new Date(report.created_at).toLocaleString()}</span>
        </div>

        {/* Assigned officer info */}
        {assignedOfficer && (
          <div className="rounded-md bg-accent p-2.5 text-xs space-y-1">
            <p className="font-semibold text-accent-foreground flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" /> Assigned Officer
            </p>
            <p className="text-foreground">{assignedOfficer.name} — {assignedOfficer.designation}</p>
            <p className="text-muted-foreground">{assignedOfficer.ward_name}</p>
            {assignedOfficer.phone && (
              <p className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" /> {assignedOfficer.phone}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        {isPending && (
          <div className="space-y-2 pt-1">
            <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
              <SelectTrigger className="text-xs h-9">
                <SelectValue placeholder="Select Ward Officer..." />
              </SelectTrigger>
              <SelectContent>
                {officers.map((o) => (
                  <SelectItem key={o.id} value={o.id} className="text-xs">
                    {o.name} — {o.ward_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="w-full" onClick={handleAssignAndNotify} disabled={updateStatus.isPending}>
              <Send className="mr-1 h-4 w-4" />
              Assign & Notify Officer
            </Button>
          </div>
        )}

        {isActionTaken && (
          <Button
            size="sm"
            variant="outline"
            className="w-full border-success text-success hover:bg-success hover:text-success-foreground"
            onClick={() => updateStatus.mutate({ id: report.id, status: "Cleaned" })}
            disabled={updateStatus.isPending}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Mark as Resolved
          </Button>
        )}

        {/* Citizen feedback (active learning) */}
        <div className="flex items-center justify-between border-t pt-2 text-xs">
          <span className="text-muted-foreground">Was this prediction correct?</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={vote === "up" ? "default" : "outline"}
              className="h-7 px-2"
              onClick={() => {
                submit("up");
                toast.success("Thanks! Your feedback helps the model learn.");
              }}
              aria-label="Mark prediction correct"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={vote === "down" ? "destructive" : "outline"}
              className="h-7 px-2"
              onClick={() => {
                submit("down");
                toast.success("Thanks! Your feedback helps the model learn.");
              }}
              aria-label="Mark prediction wrong"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
