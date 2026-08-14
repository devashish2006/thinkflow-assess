CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  question TEXT NOT NULL,
  pseudocode TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'JavaScript',
  understanding_score INTEGER NOT NULL DEFAULT 0,
  approach_score INTEGER NOT NULL DEFAULT 0,
  pseudocode_score INTEGER NOT NULL DEFAULT 0,
  logic_score INTEGER NOT NULL DEFAULT 0,
  correctness_score INTEGER NOT NULL DEFAULT 0,
  complexity_score INTEGER NOT NULL DEFAULT 0,
  edge_case_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  recommendation TEXT NOT NULL DEFAULT 'NOT SHORTLISTED',
  feedback TEXT NOT NULL DEFAULT '',
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.submissions TO anon;
GRANT SELECT, INSERT ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo app can read submissions" ON public.submissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Demo app can create submissions" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);