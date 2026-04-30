ALTER TABLE public.garbage_reports DROP CONSTRAINT IF EXISTS garbage_reports_status_check;

ALTER TABLE public.garbage_reports
ADD CONSTRAINT garbage_reports_status_check
CHECK (status = ANY (ARRAY['Pending'::text, 'Cleaned'::text, 'No Cleanup Required'::text]));

CREATE OR REPLACE FUNCTION public.recalculate_garbage_report_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Cleaned' THEN
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

DROP TRIGGER IF EXISTS set_garbage_report_status ON public.garbage_reports;

CREATE TRIGGER set_garbage_report_status
BEFORE INSERT OR UPDATE OF detected, confidence
ON public.garbage_reports
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_garbage_report_status();

UPDATE public.garbage_reports
SET status = CASE
  WHEN status = 'Cleaned' THEN 'Cleaned'
  WHEN COALESCE(detected, false) = true AND COALESCE(confidence, 0) >= 0.4 THEN 'Pending'
  ELSE 'No Cleanup Required'
END;