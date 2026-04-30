/**
 * Reports controller — handles CRUD for garbage_reports.
 */
const { supabase } = require("../config/supabase");

// GET /api/reports
async function listReports(req, res) {
  const { data, error } = await supabase
    .from("garbage_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ reports: data });
}

// GET /api/reports/:id
async function getReport(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("garbage_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Report not found" });
  res.json({ report: data });
}

// POST /api/reports
async function createReport(req, res) {
  const { image_url, latitude, longitude, detected, confidence, status } =
    req.body;

  if (!image_url || latitude == null || longitude == null) {
    return res
      .status(400)
      .json({ error: "image_url, latitude, longitude are required" });
  }

  const payload = {
    image_url,
    latitude: Number(latitude),
    longitude: Number(longitude),
    detected: Boolean(detected),
    confidence: Number(confidence ?? 0),
    status: status || "Pending",
  };

  const { data, error } = await supabase
    .from("garbage_reports")
    .insert(payload)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ report: data });
}

// PATCH /api/reports/:id
async function updateReport(req, res) {
  const { id } = req.params;
  const { status, assigned_officer_id, ward_area } = req.body;

  const update = {};
  if (status !== undefined) update.status = status;
  if (assigned_officer_id !== undefined)
    update.assigned_officer_id = assigned_officer_id;
  if (ward_area !== undefined) update.ward_area = ward_area;

  const { data, error } = await supabase
    .from("garbage_reports")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ report: data });
}

module.exports = { listReports, getReport, createReport, updateReport };
