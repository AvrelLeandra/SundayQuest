import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Resolve paths for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env explicitly
const envConfig = dotenv.parse(fs.readFileSync(join(__dirname, '.env.local')));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const visitedPlaces = [
  "Communiti", "Art of delight", "Yuki", "Daily sushi", "Empire", 
  "We neighborhood", "Ferara", "Pizza bakery", "Brik oven", "Taiki", 
  "Kazan", "Conçu", "Corner house", "Meghana’s", "Dolci desserts", 
  "Hope in the wall(8)", "Buffalo Wild Wings", "Paper & pie", "Truffles", 
  "Little white kitchen", "Just loaf", "Toit", "Smoke house deli", 
  "Hard Rock Cafe", "Good flippin’ burger", "McDonald’s", "Johnny rockets", 
  "Zed the baker", "Lakeview milkbar", "Lazy Suzy", "Glen’s bakehouse", 
  "23rd street pizza", "Matteo coffea", "Cocos kitchen", "Chili & chives", 
  "Nasi and mee", "Mani’s", "Si Nonna’s", "Coast II coast", "Neon market", 
  "Kuuraku", "Dindigul thalappakatti", "Spettacolare", "Smash guys", 
  "Bologna", "Cantan", "Sultanate of shawarma", "Serious slice", 
  "Beyondburger inc", "The burgery in"
];

async function seed() {
  console.log("Seeding Database...");
  
  // 1. Verify schema exists by querying places
  const { data: test, error: testErr } = await supabase.from('places').select('id').limit(1);
  if (testErr) {
    console.error("Make sure you run database_schema_v2.sql in Supabase first!", testErr);
    return;
  }
  
  // 2. Fetch existing to prevent duplicates
  const { data: existing } = await supabase.from('places').select('name');
  const existingNames = new Set(existing?.map(p => p.name) || []);

  const toInsert = visitedPlaces
    .filter(name => !existingNames.has(name))
    .map((name, index) => ({
      name,
      city: "Bangalore",
      neighborhood: ["Indiranagar", "Koramangala", "CBD", "Jayanagar"][index % 4],
      category: index % 3 === 0 ? "Dessert" : index % 2 === 0 ? "Cafe" : "Restaurant",
      favorite: index % 5 === 0,
      price_level: index % 2 === 0 ? 2 : 3,
      latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
    }));

  if (toInsert.length > 0) {
    const { data: places, error: placeErr } = await supabase.from('places').insert(toInsert).select();
    if (placeErr) {
       console.error("Error inserting places:", placeErr);
       return;
    }
    console.log(`Inserted ${places.length} places!`);
    
    // Seed visits for them
    const visits = places.map((place, index) => ({
      place_id: place.id,
      date_visited: '2023-10-15',
      personal_rating: Math.floor(Math.random() * 3) + 7, // 7 to 9
      personal_note: `Our trip to ${place.name}. Good vibes and great food!`,
      would_return: true
    }));
    
    const { error: visErr } = await supabase.from('visits').insert(visits);
    if (visErr) {
       console.error("Error inserting visits:", visErr);
    } else {
       console.log("Visits seeded!");
    }
  } else {
    console.log("Places already seeded.");
  }
}

seed();
