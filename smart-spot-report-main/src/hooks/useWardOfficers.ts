import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WardOfficer } from "@/lib/types";

export function useWardOfficers() {
  return useQuery<WardOfficer[]>({
    queryKey: ["ward-officers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ward_officers")
        .select("*")
        .order("ward_name");
      if (error) throw error;
      return (data ?? []) as WardOfficer[];
    },
  });
}

export function useCreateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (officer: { name: string; designation: string; ward_name: string; phone?: string; email?: string }) => {
      const { data, error } = await supabase.from("ward_officers").insert(officer).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ward-officers"] }),
  });
}

export function useUpdateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string; name?: string; designation?: string; ward_name?: string; phone?: string; email?: string }) => {
      const { error } = await supabase.from("ward_officers").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ward-officers"] }),
  });
}

export function useDeleteOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ward_officers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ward-officers"] }),
  });
}
