-- Sunday Quest: Food Cards, Quests & Quest Edits Sync Schema for Supabase
-- Copy and paste ALL lines below directly into the Supabase SQL Editor (do not type the file name!)
-- URL: https://supabase.com/dashboard -> Select Your Project -> SQL Editor -> New Query -> Run

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

-- 3. Quest Edits Table (Syncs notes, dishes tried, visit count, would_return & favorites for all quests)
CREATE TABLE IF NOT EXISTS quest_edits (
  place_id text PRIMARY KEY,
  notes text,
  would_return boolean,
  visit_count integer DEFAULT 1,
  favorite boolean,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE food_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_edits ENABLE ROW LEVEL SECURITY;

-- 5. Allow read/write policies for app usage
DROP POLICY IF EXISTS "Allow all on food_cards" ON food_cards;
CREATE POLICY "Allow all on food_cards" ON food_cards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on custom_quests" ON custom_quests;
CREATE POLICY "Allow all on custom_quests" ON custom_quests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on quest_edits" ON quest_edits;
CREATE POLICY "Allow all on quest_edits" ON quest_edits FOR ALL USING (true) WITH CHECK (true);

-- 6. Enable Realtime broadcast on all tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE food_cards;
    ALTER PUBLICATION supabase_realtime ADD TABLE custom_quests;
    ALTER PUBLICATION supabase_realtime ADD TABLE quest_edits;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
