import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GarbageReport } from "@/lib/types";
import { normalizeReport } from "@/lib/report-utils";

export function useReports() {
  return useQuery<GarbageReport[]>({
    queryKey: ["garbage-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("garbage_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(normalizeReport);
    },
  });
}

export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (report: {
      image_url: string;
      latitude: number;
      longitude: number;
      detected: boolean;
      confidence: number;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("garbage_reports")
        .insert(report)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["garbage-reports"] }),
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, assigned_officer_id, ward_area }: {
      id: string;
      status: string;
      assigned_officer_id?: string;
      ward_area?: string | null;
    }) => {
      const update: { status: string; assigned_officer_id?: string; ward_area?: string | null } = { status };
      if (assigned_officer_id !== undefined) update.assigned_officer_id = assigned_officer_id;
      if (ward_area !== undefined) update.ward_area = ward_area;

      const { error } = await supabase
        .from("garbage_reports")
        .update(update)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["garbage-reports"] }),
  });
}
