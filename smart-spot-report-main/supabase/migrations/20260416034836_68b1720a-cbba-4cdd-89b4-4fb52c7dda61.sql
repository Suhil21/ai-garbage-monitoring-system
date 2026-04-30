
CREATE POLICY "Anyone can insert ward officers"
ON public.ward_officers FOR INSERT TO public
WITH CHECK (name IS NOT NULL AND ward_name IS NOT NULL);

CREATE POLICY "Anyone can update ward officers"
ON public.ward_officers FOR UPDATE TO public
USING (true)
WITH CHECK (name IS NOT NULL AND ward_name IS NOT NULL);

CREATE POLICY "Anyone can delete ward officers"
ON public.ward_officers FOR DELETE TO public
USING (true);
