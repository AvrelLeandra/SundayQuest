-- Sunday Quest: Relational Schema (Places & Visits)

-- 1. Create the Places table (Restaurants, Cafes, Dessert Spots)
CREATE TABLE IF NOT EXISTS places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  city text,
  neighborhood text,
  category text, -- e.g., 'Cafe', 'Restaurant', 'Dessert'
  lat double precision,
  lng double precision,
  favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Visits table (Tracking each time you go to a place)
CREATE TABLE IF NOT EXISTS visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  item_name text,
  price_level integer, -- 1 to 3
  photo_url text,
  taste_score integer CHECK (taste_score >= 1 AND taste_score <= 100),
  vibe_score integer CHECK (vibe_score >= 1 AND vibe_score <= 100),
  value_score integer CHECK (value_score >= 1 AND value_score <= 100),
  overall_score integer CHECK (overall_score >= 1 AND overall_score <= 100),
  notes text,
  would_return boolean DEFAULT true,
  tags text[], -- Array of strings e.g., ['cozy', 'expensive']
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for personal use)
CREATE POLICY "Allow public read access on places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public insert on places" ON places FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on places" ON places FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on places" ON places FOR DELETE USING (true);

CREATE POLICY "Allow public read access on visits" ON visits FOR SELECT USING (true);
CREATE POLICY "Allow public insert on visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on visits" ON visits FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on visits" ON visits FOR DELETE USING (true);
