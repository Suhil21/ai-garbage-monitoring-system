export interface GarbageReport {
  id: string;
  image_url: string;
  latitude: number;
  longitude: number;
  status: string;
  detected: boolean | null;
  confidence: number | null;
  ward_area: string | null;
  assigned_officer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WardOfficer {
  id: string;
  name: string;
  designation: string;
  ward_name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
}
