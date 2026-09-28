import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const curatedData = [
  { id: "1", name: "Communiti", city: "Bangalore", neighborhood: "Residency Road", category: "Bar & Grill", price: "$$", lat: 12.9716, lng: 77.6046, rating: 4.4, favorite: true },
  { id: "2", name: "Art of delight", city: "Bangalore", neighborhood: "Residency Road", category: "Dessert", price: "$$", lat: 12.9723, lng: 77.6030, rating: 4.6, favorite: true },
  { id: "3", name: "Yuki", city: "Bangalore", neighborhood: "Koramangala", category: "Pan-Asian", price: "$$$", lat: 12.9352, lng: 77.6245, rating: 4.5, favorite: false },
  { id: "4", name: "Daily sushi", city: "Bangalore", neighborhood: "Indiranagar", category: "Japanese", price: "$$$", lat: 12.9784, lng: 77.6408, rating: 4.3, favorite: false },
  { id: "5", name: "Empire", city: "Bangalore", neighborhood: "Church Street", category: "Indian", price: "$", lat: 12.9750, lng: 77.6016, rating: 4.1, favorite: true },
  { id: "6", name: "We neighborhood", city: "Bangalore", neighborhood: "HSR Layout", category: "Cafe", price: "$$", lat: 12.9121, lng: 77.6446, rating: 4.2, favorite: false },
  { id: "7", name: "Ferara", city: "Bangalore", neighborhood: "Indiranagar", category: "Cafe", price: "$$", lat: 12.9780, lng: 77.6400, rating: 4.0, favorite: false },
  { id: "8", name: "Pizza bakery", city: "Bangalore", neighborhood: "Indiranagar", category: "Italian", price: "$$$", lat: 12.9791, lng: 77.6404, rating: 4.5, favorite: true },
  { id: "9", name: "Brik oven", city: "Bangalore", neighborhood: "Church Street", category: "Italian", price: "$$$", lat: 12.9748, lng: 77.6035, rating: 4.6, favorite: false },
  { id: "10", name: "Taiki", city: "Bangalore", neighborhood: "Indiranagar", category: "Pan-Asian", price: "$$", lat: 12.9783, lng: 77.6410, rating: 4.3, favorite: true },
  { id: "11", name: "Kazan", city: "Bangalore", neighborhood: "Koramangala", category: "Japanese", price: "$$$", lat: 12.9345, lng: 77.6260, rating: 4.4, favorite: false },
  { id: "12", name: "Conçu", city: "Bangalore", neighborhood: "Indiranagar", category: "Dessert", price: "$$$", lat: 12.9789, lng: 77.6401, rating: 4.7, favorite: false },
  { id: "13", name: "Corner house", city: "Bangalore", neighborhood: "Indiranagar", category: "Dessert", price: "$", lat: 12.9778, lng: 77.6412, rating: 4.8, favorite: true },
  { id: "14", name: "Meghana’s", city: "Bangalore", neighborhood: "Koramangala", category: "Indian", price: "$$", lat: 12.9348, lng: 77.6231, rating: 4.5, favorite: false },
  { id: "15", name: "Dolci desserts", city: "Bangalore", neighborhood: "Ali Asker Road", category: "Dessert", price: "$$", lat: 12.9845, lng: 77.5956, rating: 4.4, favorite: false },
  { id: "16", name: "Hope in the wall(8)", city: "Bangalore", neighborhood: "Koramangala", category: "Cafe", price: "$$", lat: 12.9361, lng: 77.6252, rating: 4.5, favorite: true },
  { id: "17", name: "Buffalo Wild Wings", city: "Bangalore", neighborhood: "Indiranagar", category: "Bar & Grill", price: "$$$", lat: 12.9795, lng: 77.6405, rating: 4.1, favorite: false },
  { id: "18", name: "Paper & pie", city: "Bangalore", neighborhood: "Indiranagar", category: "Cafe", price: "$$", lat: 12.9781, lng: 77.6418, rating: 4.4, favorite: false },
  { id: "19", name: "Truffles", city: "Bangalore", neighborhood: "Koramangala", category: "Burgers", price: "$$", lat: 12.9342, lng: 77.6241, rating: 4.6, favorite: true },
  { id: "20", name: "Little white kitchen", city: "Bangalore", neighborhood: "Jayanagar", category: "Cafe", price: "$$", lat: 12.9250, lng: 77.5938, rating: 4.2, favorite: false },
  { id: "21", name: "Just loaf", city: "Bangalore", neighborhood: "Koramangala", category: "Cafe", price: "$$", lat: 12.9355, lng: 77.6244, rating: 4.1, favorite: false },
  { id: "22", name: "Toit", city: "Bangalore", neighborhood: "Indiranagar", category: "Bar & Grill", price: "$$$", lat: 12.9792, lng: 77.6409, rating: 4.7, favorite: true },
  { id: "23", name: "Smoke house deli", city: "Bangalore", neighborhood: "Lavelle Road", category: "European", price: "$$$", lat: 12.9733, lng: 77.5951, rating: 4.5, favorite: false },
  { id: "24", name: "Hard Rock Cafe", city: "Bangalore", neighborhood: "St Marks Road", category: "Bar & Grill", price: "$$$", lat: 12.9721, lng: 77.6011, rating: 4.3, favorite: false },
  { id: "25", name: "Good flippin’ burger", city: "Bangalore", neighborhood: "Indiranagar", category: "Burgers", price: "$$", lat: 12.9785, lng: 77.6420, rating: 4.5, favorite: true },
  { id: "26", name: "McDonald’s", city: "Bangalore", neighborhood: "Various", category: "Fast Food", price: "$", lat: 12.9716, lng: 77.5946, rating: 4.0, favorite: false },
  { id: "27", name: "Johnny rockets", city: "Bangalore", neighborhood: "Whitefield", category: "Burgers", price: "$$$", lat: 12.9902, lng: 77.7282, rating: 4.1, favorite: false },
  { id: "28", name: "Zed the baker", city: "Bangalore", neighborhood: "CBD", category: "Dessert", price: "$$", lat: 12.9755, lng: 77.6001, rating: 4.3, favorite: false },
  { id: "29", name: "Lakeview milkbar", city: "Bangalore", neighborhood: "MG Road", category: "Dessert", price: "$$", lat: 12.9742, lng: 77.6083, rating: 4.2, favorite: true },
  { id: "30", name: "Lazy Suzy", city: "Bangalore", neighborhood: "Indiranagar", category: "Cafe", price: "$$$", lat: 12.9788, lng: 77.6403, rating: 4.6, favorite: false },
  { id: "31", name: "Glen’s bakehouse", city: "Bangalore", neighborhood: "Lavelle Road", category: "Dessert", price: "$$", lat: 12.9738, lng: 77.5955, rating: 4.4, favorite: false },
  { id: "32", name: "23rd street pizza", city: "Bangalore", neighborhood: "Jayanagar", category: "Italian", price: "$$", lat: 12.9290, lng: 77.5830, rating: 4.2, favorite: false },
  { id: "33", name: "Matteo coffea", city: "Bangalore", neighborhood: "Church Street", category: "Cafe", price: "$$", lat: 12.9751, lng: 77.6025, rating: 4.5, favorite: true },
  { id: "34", name: "Cocos kitchen", city: "Bangalore", neighborhood: "Koramangala", category: "Indian", price: "$$", lat: 12.9349, lng: 77.6255, rating: 4.1, favorite: false },
  { id: "35", name: "Chili & chives", city: "Bangalore", neighborhood: "HSR Layout", category: "Pan-Asian", price: "$$", lat: 12.9115, lng: 77.6390, rating: 4.0, favorite: false },
  { id: "36", name: "Nasi and mee", city: "Bangalore", neighborhood: "Koramangala", category: "Pan-Asian", price: "$$$", lat: 12.9350, lng: 77.6248, rating: 4.4, favorite: false },
  { id: "37", name: "Mani’s", city: "Bangalore", neighborhood: "Jeevan Bima Nagar", category: "Indian", price: "$", lat: 12.9650, lng: 77.6590, rating: 4.2, favorite: true },
  { id: "38", name: "Si Nonna’s", city: "Bangalore", neighborhood: "JP Nagar", category: "Italian", price: "$$$", lat: 12.9080, lng: 77.5920, rating: 4.3, favorite: false },
  { id: "39", name: "Coast II coast", city: "Bangalore", neighborhood: "Koramangala", category: "Seafood", price: "$$", lat: 12.9365, lng: 77.6265, rating: 4.4, favorite: false },
  { id: "40", name: "Neon market", city: "Bangalore", neighborhood: "Indiranagar", category: "Cafe", price: "$$", lat: 12.9790, lng: 77.6415, rating: 4.3, favorite: false },
  { id: "41", name: "Kuuraku", city: "Bangalore", neighborhood: "Koramangala", category: "Japanese", price: "$$$", lat: 12.9351, lng: 77.6250, rating: 4.5, favorite: true },
  { id: "42", name: "Dindigul thalappakatti", city: "Bangalore", neighborhood: "Indiranagar", category: "Indian", price: "$$", lat: 12.9782, lng: 77.6402, rating: 4.1, favorite: false },
  { id: "43", name: "Spettacolare", city: "Bangalore", neighborhood: "HSR Layout", category: "Italian", price: "$$", lat: 12.9125, lng: 77.6450, rating: 4.2, favorite: false },
  { id: "44", name: "Smash guys", city: "Bangalore", neighborhood: "Koramangala", category: "Burgers", price: "$$", lat: 12.9346, lng: 77.6240, rating: 4.3, favorite: false },
  { id: "45", name: "Bologna", city: "Bangalore", neighborhood: "Indiranagar", category: "Italian", price: "$$$", lat: 12.9793, lng: 77.6406, rating: 4.5, favorite: true },
  { id: "46", name: "Cantan", city: "Bangalore", neighborhood: "Lavelle Road", category: "Chinese", price: "$$$", lat: 12.9730, lng: 77.5950, rating: 4.4, favorite: false },
  { id: "47", name: "Sultanate of shawarma", city: "Bangalore", neighborhood: "Koramangala", category: "Middle Eastern", price: "$", lat: 12.9358, lng: 77.6235, rating: 4.2, favorite: false },
  { id: "48", name: "Serious slice", city: "Bangalore", neighborhood: "Indiranagar", category: "Italian", price: "$$", lat: 12.9786, lng: 77.6411, rating: 4.1, favorite: false },
  { id: "49", name: "Beyondburger inc", city: "Bangalore", neighborhood: "HSR Layout", category: "Burgers", price: "$$", lat: 12.9128, lng: 77.6440, rating: 4.0, favorite: false },
  { id: "50", name: "The burgery in", city: "Bangalore", neighborhood: "Jayanagar", category: "Burgers", price: "$$", lat: 12.9285, lng: 77.5835, rating: 4.2, favorite: false },
];

fs.writeFileSync(join(__dirname, 'src/data/places.json'), JSON.stringify(curatedData, null, 2));
console.log("Curated accurate Bangalore data injected directly into JSON!");
