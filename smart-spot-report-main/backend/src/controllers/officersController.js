/**
 * Officers controller — handles CRUD for ward_officers.
 */
const { supabase } = require("../config/supabase");

async function listOfficers(req, res) {
  const { data, error } = await supabase
    .from("ward_officers")
    .select("*")
    .order("ward_name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ officers: data });
}

async function createOfficer(req, res) {
  const { name, designation, ward_name, phone, email } = req.body;
  if (!name || !ward_name) {
    return res.status(400).json({ error: "name and ward_name are required" });
  }
  const { data, error } = await supabase
    .from("ward_officers")
    .insert({ name, designation, ward_name, phone, email })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ officer: data });
}

async function updateOfficer(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("ward_officers")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ officer: data });
}

async function deleteOfficer(req, res) {
  const { id } = req.params;
  const { error } = await supabase.from("ward_officers").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
}

module.exports = { listOfficers, createOfficer, updateOfficer, deleteOfficer };
