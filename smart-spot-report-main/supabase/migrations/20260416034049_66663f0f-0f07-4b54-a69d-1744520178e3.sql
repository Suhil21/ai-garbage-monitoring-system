
-- Create ward_officers table
CREATE TABLE public.ward_officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL DEFAULT 'Sanitation Inspector',
  ward_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ward_officers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ward officers"
ON public.ward_officers FOR SELECT TO public
USING (true);

-- Add columns to garbage_reports
ALTER TABLE public.garbage_reports
  ADD COLUMN ward_area TEXT,
  ADD COLUMN assigned_officer_id UUID REFERENCES public.ward_officers(id);

-- Update status constraint to include new statuses
ALTER TABLE public.garbage_reports DROP CONSTRAINT IF EXISTS garbage_reports_status_check;
ALTER TABLE public.garbage_reports
ADD CONSTRAINT garbage_reports_status_check
CHECK (status = ANY (ARRAY['Pending'::text, 'Cleaned'::text, 'No Cleanup Required'::text, 'Action Taken'::text]));

-- Update the trigger function to include Action Taken
CREATE OR REPLACE FUNCTION public.recalculate_garbage_report_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('Cleaned', 'Action Taken') THEN
    RETURN NEW;
  END IF;

  IF COALESCE(NEW.detected, false) = true AND COALESCE(NEW.confidence, 0) >= 0.4 THEN
    NEW.status := 'Pending';
  ELSE
    NEW.status := 'No Cleanup Required';
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS set_garbage_report_status ON public.garbage_reports;
CREATE TRIGGER set_garbage_report_status
BEFORE INSERT OR UPDATE OF detected, confidence
ON public.garbage_reports
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_garbage_report_status();

-- Seed some sample ward officers
INSERT INTO public.ward_officers (name, designation, ward_name, phone, email) VALUES
  ('Rajesh Kumar', 'Sanitation Inspector', 'Ward 1 - Central', '9876543210', 'rajesh.kumar@municipality.gov.in'),
  ('Priya Sharma', 'Sanitation Inspector', 'Ward 2 - North', '9876543211', 'priya.sharma@municipality.gov.in'),
  ('Amit Patel', 'Sanitation Inspector', 'Ward 3 - South', '9876543212', 'amit.patel@municipality.gov.in'),
  ('Sunita Verma', 'Senior Inspector', 'Ward 4 - East', '9876543213', 'sunita.verma@municipality.gov.in'),
  ('Manoj Singh', 'Sanitation Inspector', 'Ward 5 - West', '9876543214', 'manoj.singh@municipality.gov.in');

-- Allow updating assigned_officer, ward_area, and status on reports
DROP POLICY IF EXISTS "Anyone can mark pending reports as cleaned" ON public.garbage_reports;
CREATE POLICY "Anyone can update report actions"
ON public.garbage_reports
FOR UPDATE
TO public
USING (true)
WITH CHECK (status = ANY (ARRAY['Pending'::text, 'Cleaned'::text, 'Action Taken'::text, 'No Cleanup Required'::text]));
