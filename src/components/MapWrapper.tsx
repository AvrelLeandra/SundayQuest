"use client";

import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Default to a generic location if no pins (e.g. San Francisco or user's city)
const defaultCenter = {
  lat: 12.9716, // Bangalore
  lng: 77.5946,
};

// Tiramisu-style map styling (Creams, Cocoa, Espresso)
const retroMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#fff8e7" }] }, // Mascarpone base
  { elementType: "labels.text.fill", stylers: [{ color: "#5b3b24" }] }, // Espresso text
  { elementType: "labels.text.stroke", stylers: [{ color: "#fff8e7" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#8b5a2b" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f5e6d3" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8b5a2b" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#eaddcc" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#7c4a21" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e6c287" }] }, // Ladyfinger roads
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d4a373" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#5b3b24" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d4a373" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#8b5a2b" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#3d2314" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c89f70" }] }, // Caramel water
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d2314" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#c89f70" }] },
];

export default function MapWrapper({ markers = [] }: { markers?: any[] }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const options = useMemo(
    () => ({
      styles: retroMapStyles,
      disableDefaultUI: true,
      zoomControl: true,
    }),
    []
  );

  if (loadError) return <div className="p-4 text-brand-primary">Error loading maps</div>;
  if (!isLoaded) return <div className="p-4 animate-pulse">LOADING MAP...</div>;

  return (
    <div className="w-full h-full relative border-b-4 border-pixel-border">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={defaultCenter}
        options={options}
      >
        {/* We will render custom pixel pins here */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={{ lat: marker.lat, lng: marker.lng }} />
        ))}
      </GoogleMap>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] bg-brand-primary/90 px-2 py-1 pixel-border">
          QUEST MAP
        </h2>
      </div>
    </div>
  );
}
