import { NextRequest, NextResponse } from "next/server";

const BANGALORE_NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
  indiranagar: { lat: 12.9784, lng: 77.6408 },
  koramangala: { lat: 12.9352, lng: 77.6245 },
  "hsr layout": { lat: 12.9121, lng: 77.6446 },
  hsr: { lat: 12.9121, lng: 77.6446 },
  "jp nagar": { lat: 12.9063, lng: 77.5857 },
  jayanagar: { lat: 12.9308, lng: 77.5838 },
  whitefield: { lat: 12.9698, lng: 77.7500 },
  malleshwaram: { lat: 13.0031, lng: 77.5643 },
  "church street": { lat: 12.9752, lng: 77.6050 },
  "mg road": { lat: 12.9756, lng: 77.6097 },
  "brigade road": { lat: 12.9733, lng: 77.6074 },
  "lavelle road": { lat: 12.9710, lng: 77.5980 },
  "cunningham road": { lat: 12.9872, lng: 77.5968 },
  "frazer town": { lat: 12.9980, lng: 77.6150 },
  pulakeshinagar: { lat: 12.9980, lng: 77.6150 },
  "vasanth nagar": { lat: 12.9890, lng: 77.5910 },
  sadashivanagar: { lat: 13.0068, lng: 77.5813 },
  basavanagudi: { lat: 12.9422, lng: 77.5753 },
  "gandhi bazaar": { lat: 12.9450, lng: 77.5715 },
  banashankari: { lat: 12.9255, lng: 77.5468 },
  "btm layout": { lat: 12.9166, lng: 77.6101 },
  btm: { lat: 12.9166, lng: 77.6101 },
  "sarjapur road": { lat: 12.9237, lng: 77.6534 },
  sarjapur: { lat: 12.9237, lng: 77.6534 },
  bellandur: { lat: 12.9260, lng: 77.6762 },
  marathahalli: { lat: 12.9591, lng: 77.6974 },
  "electronic city": { lat: 12.8452, lng: 77.6602 },
  "kalyan nagar": { lat: 13.0238, lng: 77.6441 },
  kammanahalli: { lat: 13.0093, lng: 77.6377 },
  rajajinagar: { lat: 12.9982, lng: 77.5530 },
  "commercial street": { lat: 12.9822, lng: 77.6083 },
  ulsoor: { lat: 12.9779, lng: 77.6245 },
  "richmond town": { lat: 12.9646, lng: 77.6033 },
  hebbal: { lat: 13.0358, lng: 77.5970 },
  yelahanka: { lat: 13.1007, lng: 77.5963 },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const neighborhood = searchParams.get("neighborhood") || "";
  const queryParam = searchParams.get("q") || "";

  // 1. Try Nominatim Geocoding with fallback queries
  const queries: string[] = [];
  if (name && neighborhood) {
    queries.push(`${name} ${neighborhood} Bangalore, Karnataka, India`);
  }
  if (queryParam) {
    queries.push(`${queryParam} Bangalore, Karnataka, India`);
  }
  if (name) {
    queries.push(`${name} Bangalore, Karnataka, India`);
  }
  if (neighborhood) {
    queries.push(`${neighborhood} Bangalore, Karnataka, India`);
  }

  for (const q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "SundayQuest/1.0 (contact: info@sundayquest.app)",
        },
        next: { revalidate: 86400 }, // Cache geocode results for 24 hours
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            return NextResponse.json({
              success: true,
              lat,
              lng,
              displayName: data[0].display_name,
              source: "nominatim",
            });
          }
        }
      }
    } catch (err) {
      console.warn("Geocoding query error for:", q, err);
    }
  }

  // 2. Fallback to Bangalore Neighborhood Dictionary
  const searchTarget = (neighborhood + " " + name).toLowerCase();
  for (const [key, coords] of Object.entries(BANGALORE_NEIGHBORHOODS)) {
    if (searchTarget.includes(key)) {
      // Add a slight micro-jitter (10-30 meters) so multiple places in the same neighborhood don't stack directly on top of each other
      const jitterLat = (Math.random() - 0.5) * 0.003;
      const jitterLng = (Math.random() - 0.5) * 0.003;
      return NextResponse.json({
        success: true,
        lat: coords.lat + jitterLat,
        lng: coords.lng + jitterLng,
        source: "neighborhood_dictionary",
      });
    }
  }

  // 3. Fallback to Central Bangalore with slight jitter
  const randomJitterLat = (Math.random() - 0.5) * 0.01;
  const randomJitterLng = (Math.random() - 0.5) * 0.01;
  return NextResponse.json({
    success: true,
    lat: 12.9716 + randomJitterLat,
    lng: 77.5946 + randomJitterLng,
    source: "city_center_fallback",
  });
}
