import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envConfig = dotenv.parse(fs.readFileSync(join(__dirname, '.env.local')));

const GOOGLE_API_KEY = envConfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const placesToFetch = [
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

async function fetchPlacesData() {
  console.log("Fetching accurate real-world data from Google Places...");
  const results = [];

  for (let i = 0; i < placesToFetch.length; i++) {
    const query = encodeURIComponent(`${placesToFetch[i]} Bangalore`);
    console.log(`[${i+1}/${placesToFetch.length}] Fetching ${placesToFetch[i]}...`);
    
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        
        // Extract neighborhood from address
        const parts = place.formatted_address ? place.formatted_address.split(',') : [];
        let neighborhood = "Bangalore";
        if (parts.length >= 3) {
            neighborhood = parts[parts.length - 3].trim(); // Rough approximation of neighborhood
        }
        
        let category = "Restaurant";
        const types = place.types || [];
        if (types.includes("cafe")) category = "Cafe";
        else if (types.includes("bakery") || types.includes("dessert")) category = "Dessert";
        else if (types.includes("bar")) category = "Bar & Grill";

        const price = place.price_level === 1 ? "$" : place.price_level === 2 ? "$$" : place.price_level === 3 ? "$$$" : place.price_level === 4 ? "$$$$" : "$$";

        results.push({
          id: (i + 1).toString(),
          name: place.name || placesToFetch[i],
          city: "Bangalore",
          neighborhood: neighborhood.replace(/[0-9\-]/g, '').trim() || "City Center", // Clean up zip codes
          category: category,
          price: price,
          lat: place.geometry?.location?.lat || 12.9716,
          lng: place.geometry?.location?.lng || 77.5946,
          rating: place.rating || 4.0,
          favorite: i % 5 === 0 // Keeping a few favorites
        });
      } else {
        // Fallback if not found
        results.push({
          id: (i + 1).toString(),
          name: placesToFetch[i],
          city: "Bangalore",
          neighborhood: "City Center",
          category: "Restaurant",
          price: "$$",
          lat: 12.9716,
          lng: 77.5946,
          rating: 8.5,
          favorite: false
        });
      }
      
      // Sleep slightly to avoid rate limit bursts
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error("Failed to fetch", placesToFetch[i], e);
    }
  }

  // Create dir if doesn't exist
  if (!fs.existsSync(join(__dirname, 'src/data'))) {
    fs.mkdirSync(join(__dirname, 'src/data'), { recursive: true });
  }

  fs.writeFileSync(join(__dirname, 'src/data/places.json'), JSON.stringify(results, null, 2));
  console.log("Successfully generated src/data/places.json!");
}

fetchPlacesData();
