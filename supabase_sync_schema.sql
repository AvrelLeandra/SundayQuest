-- Sunday Quest: Food Cards & Custom Quests Sync Schema for Supabase
-- Run this in your Supabase SQL Editor (https://app.supabase.com -> Project -> SQL Editor)

-- 1. Food Cards Table
CREATE TABLE IF NOT EXISTS food_cards (
  id text PRIMARY KEY,
  name text NOT NULL,
  place_name text NOT NULL,
  neighborhood text,
  category text NOT NULL,
  points integer DEFAULT 0,
  rating integer DEFAULT 5,
  color_theme text DEFAULT 'coral',
  image_url text,
  created_at text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Custom Quests Table
CREATE TABLE IF NOT EXISTS custom_quests (
  id text PRIMARY KEY,
  name text NOT NULL,
  city text DEFAULT 'Bangalore',
  neighborhood text,
  category text,
  price_level integer DEFAULT 2,
  rating numeric DEFAULT 0,
  favorite boolean DEFAULT false,
  would_return boolean,
  notes text,
  lat double precision,
  lng double precision,
  visit_count integer DEFAULT 1,
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE food_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_quests ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read/write policies for personal app usage
DROP POLICY IF EXISTS "Allow all on food_cards" ON food_cards;
CREATE POLICY "Allow all on food_cards" ON food_cards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on custom_quests" ON custom_quests;
CREATE POLICY "Allow all on custom_quests" ON custom_quests FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime broadcast on tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE food_cards;
    ALTER PUBLICATION supabase_realtime ADD TABLE custom_quests;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
