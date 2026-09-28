"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import realPlaces from '@/data/places.json';
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from "@react-google-maps/api";
import { MapPin, Navigation2, Star, LocateFixed, Compass, X } from "lucide-react";
import Link from "next/link";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Center on Bangalore
const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

// Custom Google Maps style matching the Pixel City palette
const pixelCityMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#F5E8C8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F5E8C8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#26343A" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#8DC7D8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#9FA8A9" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#F1C84B" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#C9E8E8" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1F8A63" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#26343A" }] },
];

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}
function deg2rad(deg: number) { return deg * (Math.PI/180); }

const libraries: any = ["places"];

export default function MapPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [showNearby, setShowNearby] = useState(false);
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  const [mockPlaces, setMockPlaces] = useState<any[]>(() => {
    return realPlaces.map((place: any) => {
      let baseScore = place.rating;
      if (baseScore <= 5) baseScore = baseScore * 2;
      return {
        id: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        score: baseScore.toFixed(1),
        category: place.category,
        favorite: place.favorite
      };
    });
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      if (saved.length > 0) {
        const valid = saved.filter((p: any) => p.lat && p.lng);
        const formattedSaved = valid.map((place: any) => ({
          id: place.id,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          score: (place.rating || 8.0).toFixed(1),
          category: place.category,
          favorite: place.favorite
        }));
        
        setMockPlaces((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const toAdd = formattedSaved.filter((p: any) => !existingIds.has(p.id));
          return [...toAdd, ...prev];
        });
      }
    } catch(e) {}
  }, []);

  const placesWithDistance = useMemo(() => {
    let list = mockPlaces;
    if (userLocation) {
      list = mockPlaces.map(p => ({
        ...p,
        distanceKm: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, p.lat, p.lng)
      })).sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  }, [mockPlaces, userLocation]);

  const handleLocateMe = () => {
    setLocationStatus("Locating...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          setLocationStatus("");
          if (map) {
            map.panTo(pos);
            map.setZoom(14);
          }
        },
        () => setLocationStatus("Error finding location.")
      );
    } else {
      setLocationStatus("Geolocation not supported.");
    }
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);
  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cream p-4 text-center flex-col gap-2 font-pixel">
        <h2 className="text-brick-red font-bold">MAP LOAD ERROR</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-cream relative">
      
      {/* Map Overlay UI */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
         <div className="bg-white-city border-4 border-ink p-2 shadow-[4px_4px_0_rgba(38,52,58,1)] pointer-events-auto flex flex-col gap-2">
            <h1 className="text-[0.6rem] font-bold text-ink flex items-center gap-2">
              <MapPin className="w-3 h-3 text-brick-red" /> DISTRICT MAP
            </h1>
            <button 
              onClick={() => setShowNearby(!showNearby)}
              className="bg-mustard text-ink text-[0.55rem] font-bold px-2 py-1 border-2 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none flex items-center gap-1"
            >
              <Navigation2 className="w-3 h-3" /> NEARBY QUESTS
            </button>
            <button 
              onClick={handleLocateMe}
              className="bg-light-sky text-ink text-[0.55rem] font-bold px-2 py-1 border-2 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none flex items-center gap-1"
            >
              <LocateFixed className="w-3 h-3" /> {locationStatus || "LOCATE ME"}
            </button>
         </div>
      </div>

      {/* Google Map Container */}
      <div className="flex-1 relative bg-light-sky border-b-4 border-ink">
        {!isLoaded ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-4 border-ink border-t-mustard rounded-full animate-spin mb-4"></div>
             <p className="text-xs text-ink font-bold animate-pulse">LOADING CITY GRID...</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: pixelCityMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                draggable={true}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    setUserLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  }
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#4169E1",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                  scale: 8,
                }}
                zIndex={100}
              />
            )}

            {placesWithDistance.map((place) => (
              <Marker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => setSelectedPlace(place)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: place.favorite ? "#B84545" : "#D6674D",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#26343A",
                  scale: 8,
                }}
              />
            ))}

            {selectedPlace && (
              <OverlayView
                position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(width, height) => ({ x: -(width / 2), y: -(height) - 10 })}
              >
                <div className="relative w-[130px] bg-white text-ink font-pixel px-2 pt-3 pb-2 shadow-[4px_4px_0_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-2">
                  
                  {/* Top Jagged Edge */}
                  <div 
                    className="absolute top-[-4px] left-0 w-full h-[4px]" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpolygon points='0,4 4,0 8,4' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat-x' }}
                  />
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedPlace(null)}
                    className="absolute top-0.5 right-0.5 p-1 hover:bg-gray-200 rounded-sm transition-colors z-10"
                  >
                    <X className="w-2.5 h-2.5 text-ink" strokeWidth={3} />
                  </button>

                  {/* Receipt Content */}
                  <div className="flex flex-col items-center pt-1">
                     <h2 className="text-[0.65rem] font-black tracking-widest uppercase text-center mb-0.5 leading-tight">
                       RECEIPT
                     </h2>
                     <p className="text-[0.35rem] text-center uppercase tracking-widest text-asphalt mb-1.5 font-bold">
                       Sunday Quest Log
                     </p>
                     
                     <div className="w-full border-b-[1.5px] border-dashed border-gray-400 mb-2"></div>
                     
                     <h3 className="text-[0.55rem] font-bold text-center w-full leading-tight mb-0.5 truncate px-1">
                       {selectedPlace.name}
                     </h3>
                     <div className="text-[0.35rem] text-center uppercase text-asphalt font-bold w-full mb-2">
                       {selectedPlace.category}
                     </div>
                     
                     <div className="w-full border-b border-dashed border-gray-400 mb-2"></div>
                     
                     <div className="w-full flex justify-between items-center text-[0.45rem] font-bold mb-1.5">
                       <span>RATING</span>
                       <span className="flex items-center gap-0.5"><Star className="w-2 h-2 fill-ink" /> {selectedPlace.score}</span>
                     </div>
                     
                     <div className="w-full border-b-[1.5px] border-dashed border-gray-400 mb-2 mt-0.5"></div>
                     
                     <div className="w-full flex justify-between items-end mb-3">
                       <span className="text-[0.55rem] font-black uppercase tracking-widest">Total:</span>
                       <Link href={`/quests/${selectedPlace.id}`} className="bg-ink text-white px-2 py-0.5 text-[0.4rem] font-bold hover:bg-mustard hover:text-ink border-2 border-transparent hover:border-ink transition-all shadow-[1px_1px_0_rgba(200,200,200,1)]">
                         ACCEPT
                       </Link>
                     </div>
                     
                     {/* Fake Barcode */}
                     <div className="w-full h-5 flex justify-center items-end gap-[1px] opacity-90 mt-1">
                       {[2,1,3,1,2,2,4,1,1,2,3,1,2,1,1,4,2,1,3,1,1,2].map((w, i) => (
                          <div key={i} className="bg-ink h-full" style={{ width: `${w}px` }}></div>
                       ))}
                     </div>
                  </div>

                  {/* Bottom Jagged Edge */}
                  <div 
                    className="absolute bottom-[-4px] left-0 w-full h-[4px]" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpolygon points='0,0 4,4 8,0' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat-x' }}
                  />
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Nearby Quests Sliding Panel */}
      {showNearby && (
        <div className="absolute bottom-0 left-0 w-full h-[50%] bg-cream border-t-4 border-ink shadow-[0_-8px_0_rgba(38,52,58,0.1)] z-30 animate-in slide-in-from-bottom duration-300 flex flex-col">
           <div className="bg-ink text-white-city p-2 flex justify-between items-center shrink-0">
              <span className="text-[0.6rem] font-bold tracking-widest flex items-center gap-2">
                <Navigation2 className="w-4 h-4" /> NEARBY QUESTS
              </span>
              <button 
                onClick={() => setShowNearby(false)} 
                className="bg-white-city text-ink p-1 border border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center hover:bg-concrete"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3">
              {!userLocation && (
                <div className="bg-mustard border-2 border-ink p-2 text-[0.55rem] font-bold text-ink mb-2 text-center">
                  Click "LOCATE ME" on the map to calculate exact distances to quests!
                </div>
              )}
              {userLocation && (
                <div className="bg-light-sky border-2 border-ink p-2 text-[0.45rem] font-bold text-ink mb-2 text-center opacity-80">
                  Location slightly off? Drag your blue dot to correct it!
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                 {placesWithDistance.slice(0, 20).map((place: any) => (
                   <div key={place.id} className="bg-white-city border-2 border-ink p-2 flex justify-between items-center hover:bg-light-sky">
                      <div className="flex flex-col flex-1 min-w-0 pr-2">
                        <span className="text-[0.65rem] font-bold text-ink truncate">{place.name}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <Link href={`/quests/${place.id}`} className="text-[0.5rem] text-asphalt underline font-bold">VIEW QUEST</Link>
                          
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${encodeURIComponent(`${place.name}, ${place.neighborhood}, ${place.city}`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[0.5rem] text-leaf-green flex items-center gap-0.5 font-bold hover:underline bg-transparent"
                          >
                            <Compass className="w-3 h-3" /> DIRECTIONS
                          </a>
                        </div>
                      </div>
                      <span className="text-[0.6rem] text-brick-red font-bold shrink-0">
                        {place.distanceKm !== undefined ? `${place.distanceKm.toFixed(1)} km` : "? km"}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

