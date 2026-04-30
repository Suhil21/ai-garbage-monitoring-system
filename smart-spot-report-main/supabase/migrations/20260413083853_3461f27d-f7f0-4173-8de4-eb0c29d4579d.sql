
-- Create garbage reports table
CREATE TABLE public.garbage_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Cleaned')),
  detected BOOLEAN DEFAULT true,
  confidence DOUBLE PRECISION DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.garbage_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports
CREATE POLICY "Anyone can view reports" ON public.garbage_reports FOR SELECT USING (true);

-- Allow anyone to create reports (public reporting)
CREATE POLICY "Anyone can create reports" ON public.garbage_reports FOR INSERT WITH CHECK (true);

-- Allow anyone to update status (for demo purposes)
CREATE POLICY "Anyone can update reports" ON public.garbage_reports FOR UPDATE USING (true);

-- Create storage bucket for garbage images
INSERT INTO storage.buckets (id, name, public) VALUES ('garbage-images', 'garbage-images', true);

-- Storage policies
CREATE POLICY "Anyone can view garbage images" ON storage.objects FOR SELECT USING (bucket_id = 'garbage-images');
CREATE POLICY "Anyone can upload garbage images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'garbage-images');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_garbage_reports_updated_at
  BEFORE UPDATE ON public.garbage_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
