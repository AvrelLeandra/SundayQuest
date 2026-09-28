-- Sunday Quest v2: Complete Relational Schema

-- 1. Players (User Profile & Progression)
CREATE TABLE IF NOT EXISTS players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  level integer DEFAULT 1,
  total_quest_count integer DEFAULT 0,
  current_sunday_streak integer DEFAULT 0,
  best_sunday_streak integer DEFAULT 0,
  avatar_id text DEFAULT 'sister_sprite',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Places (Google Places integration)
CREATE TABLE IF NOT EXISTS places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  address text,
  city text,
  neighborhood text,
  latitude double precision,
  longitude double precision,
  price_level integer,
  photos text[], -- Array of Google photo references
  favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Visits (Quest Logs)
CREATE TABLE IF NOT EXISTS visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  date_visited date NOT NULL,
  personal_note text,
  personal_rating integer CHECK (personal_rating >= 1 AND personal_rating <= 10),
  dish_name text,
  food_tags text[],
  photos text[], -- User uploaded photos
  would_return boolean,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FoodDex (Encyclopedia)
CREATE TABLE IF NOT EXISTS fooddex (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  food_type text NOT NULL,
  sprite_asset text,
  discovery_count integer DEFAULT 0,
  first_discovered_at timestamp with time zone,
  last_discovered_at timestamp with time zone,
  unlocked boolean DEFAULT false,
  UNIQUE(player_id, food_type)
);

-- 5. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  condition text,
  progress integer DEFAULT 0,
  unlocked_at timestamp with time zone,
  badge_asset text,
  UNIQUE(player_id, title)
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE fooddex ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Allow public access for local development (To be secured later)
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all on places" ON places FOR ALL USING (true);
CREATE POLICY "Allow all on visits" ON visits FOR ALL USING (true);
CREATE POLICY "Allow all on fooddex" ON fooddex FOR ALL USING (true);
CREATE POLICY "Allow all on achievements" ON achievements FOR ALL USING (true);
