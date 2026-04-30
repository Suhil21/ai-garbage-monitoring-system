import { useState } from "react";
import { useWardOfficers, useCreateOfficer, useUpdateOfficer, useDeleteOfficer } from "@/hooks/useWardOfficers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Shield, Plus, Pencil, Trash2, Phone, Mail, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import type { WardOfficer } from "@/lib/types";

const emptyForm = { name: "", designation: "Sanitation Inspector", ward_name: "", phone: "", email: "" };

export default function OfficersPage() {
  const { data: officers, isLoading } = useWardOfficers();
  const createOfficer = useCreateOfficer();
  const updateOfficer = useUpdateOfficer();
  const deleteOfficer = useDeleteOfficer();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const openEdit = (o: WardOfficer) => {
    setForm({ name: o.name, designation: o.designation, ward_name: o.ward_name, phone: o.phone ?? "", email: o.email ?? "" });
    setEditingId(o.id);
    setDialogOpen(true);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.ward_name.trim()) {
      toast.error("Name and Ward are required");
      return;
    }
    try {
      if (editingId) {
        await updateOfficer.mutateAsync({ id: editingId, ...form });
        toast.success("Officer updated");
      } else {
        await createOfficer.mutateAsync(form);
        toast.success("Officer added");
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove officer "${name}"?`)) return;
    try {
      await deleteOfficer.mutateAsync(id);
      toast.success("Officer removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isSaving = createOfficer.isPending || updateOfficer.isPending;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-primary" />
            Ward Officers Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage sanitation inspectors and ward-level officers</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" /> Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Officer" : "Add New Officer"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rajesh Kumar" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Sanitation Inspector" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Ward / Area *</Label>
                <Input value={form.ward_name} onChange={(e) => setForm({ ...form, ward_name: e.target.value })} placeholder="Ward 1 - Central" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" maxLength={15} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="officer@municipality.gov.in" maxLength={255} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handleSubmit} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  {editingId ? "Save Changes" : "Add Officer"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !officers?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-muted-foreground">
            <Shield className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">No officers added yet</p>
            <p className="text-sm">Click "Add Officer" to register ward-level sanitation officers</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Ward / Area</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officers.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell>{o.designation}</TableCell>
                    <TableCell>{o.ward_name}</TableCell>
                    <TableCell>
                      {o.phone ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {o.phone}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {o.email ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {o.email}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(o)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(o.id, o.name)} disabled={deleteOfficer.isPending}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
