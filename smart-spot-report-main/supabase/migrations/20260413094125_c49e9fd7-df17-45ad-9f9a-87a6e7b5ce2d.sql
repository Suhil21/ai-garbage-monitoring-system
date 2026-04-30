DROP POLICY IF EXISTS "Anyone can create reports" ON public.garbage_reports;
DROP POLICY IF EXISTS "Anyone can update reports" ON public.garbage_reports;

CREATE POLICY "Anyone can create reports"
ON public.garbage_reports
FOR INSERT
TO public
WITH CHECK (
  image_url IS NOT NULL
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND confidence IS NOT NULL
  AND confidence >= 0
  AND confidence <= 1
  AND status = ANY (ARRAY['Pending'::text, 'No Cleanup Required'::text, 'Cleaned'::text])
);

CREATE POLICY "Anyone can mark pending reports as cleaned"
ON public.garbage_reports
FOR UPDATE
TO public
USING (status = 'Pending')
WITH CHECK (status = 'Cleaned');