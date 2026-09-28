"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Calendar, Heart, X, Check, Save } from "lucide-react";
import Link from "next/link";

export default function AddRestaurantPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Form State
  const [place, setPlace] = useState({
    name: "",
    city: "",
    neighborhood: "",
    category: "Restaurant",
    priceLevel: "$$",
    photos: []
  });

  const [ratings, setRatings] = useState({
    broth: 0,
    noodles: 0,
    toppings: 0,
    spice: 0,
    value: 0,
    overall: 0
  });
  const [favorite, setFavorite] = useState(false);
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    let lat = 12.9716;
    let lng = 77.5946;
    try {
      const q = encodeURIComponent(`${place.name} ${place.neighborhood || ""} Bangalore, India`);
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${apiKey}`);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
      }
    } catch(e) {}
    
    const newQuest = {
      id: "local_" + Date.now(),
      name: place.name,
      city: "Bangalore",
      neighborhood: place.neighborhood || "Unknown",
      category: place.category,
      price_level: 2,
      rating: 0,
      favorite: favorite,
      would_return: wouldReturn,
      notes: notes,
      lat: lat,
      lng: lng,
        visit_count: 1,
        tags: place.category ? place.category.toLowerCase().split(" ") : []
      };
    const existing = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
    localStorage.setItem("sq_custom_quests", JSON.stringify([newQuest, ...existing]));
    setTimeout(() => {
      setIsSaving(false);
      setShowCelebration(true);
      setTimeout(() => {
        router.push("/quests");
      }, 2000);
    }, 800);
  };

  const updateRating = (field: string, val: number) => {
    setRatings({...ratings, [field]: val});
  };

  const PixelMeter = ({ label, field }: { label: string, field: keyof typeof ratings }) => (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between items-end mb-1">
        <label className="text-[0.5rem] font-bold text-asphalt">{label}</label>
        <span className="text-[0.6rem] font-black text-ink">{ratings[field]}/10</span>
      </div>
      <div className="flex gap-1 h-3 cursor-pointer">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
          <div
            key={val}
            onClick={() => updateRating(field, val)}
            className={`flex-1 border border-ink active:scale-95 transition-transform ${
              val <= ratings[field] ? 'bg-mustard' : 'bg-concrete/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (showCelebration) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-pixel bg-mustard">
        <div className="w-24 h-24 bg-white-city border-4 border-ink shadow-[8px_8px_0_rgba(38,52,58,1)] flex items-center justify-center animate-bounce mb-8">
          <Heart className="w-12 h-12 fill-warm-red text-warm-red" />
        </div>
        <h1 className="text-2xl text-ink font-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)] text-center px-4">
          QUEST SAVED!
        </h1>
        <p className="text-xs text-ink font-bold mt-2 bg-white-city border-2 border-ink px-4 py-2">
          +100 COINS
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden p-4 items-center justify-center relative"
      style={{
        backgroundImage: "url('/quests_bg.jpg')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        imageRendering: "pixelated"
      }}>
      <div className="w-full max-w-[420px] h-auto max-h-[95vh] bg-cream flex flex-col border-4 border-ink shadow-[8px_8px_0_rgba(38,52,58,1)] overflow-hidden relative">
      
      {/* Top Header */}
      <div className="bg-ink text-white-city p-4 shrink-0 flex items-center gap-3">
        <Link href="/quests" className="bg-white-city/20 p-2 rounded-sm border border-white-city/30 hover:bg-white-city/30 transition-colors">
          <X className="w-4 h-4" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest">LOG NEW QUEST</h1>
      </div>

      <form className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4 pb-12" onSubmit={e => e.preventDefault()}>
        
        {/* Section 1: Location & Basics */}
        <section className="bg-white-city border-4 border-ink p-3 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative mt-2">
           <div className="absolute -top-3 left-2 bg-sky-blue text-ink text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
             LOCATION INFO
           </div>
           
           <div className="flex flex-col gap-3 mt-2">
             <div className="relative">
                <label className="text-[0.5rem] text-asphalt font-bold mb-1 block">RESTAURANT NAME</label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-brick-red absolute left-2 z-10" />
                  <input 
                    type="text" 
                    value={place.name} 
                    onChange={(e) => setPlace({...place, name: e.target.value})} 
                    placeholder="Enter stop name..." 
                    className="w-full bg-cream border-2 border-ink p-2 pl-8 text-xs text-ink outline-none font-bold placeholder:font-normal placeholder:text-asphalt/50" 
                  />
                </div>
             </div>

             <div className="mt-1">
                 <label className="text-[0.5rem] text-asphalt font-bold mb-1 block">NEIGHBORHOOD</label>
                 <input type="text" value={place.neighborhood} onChange={e => setPlace({...place, neighborhood: e.target.value})} className="w-full bg-cream border-2 border-ink p-2 text-[0.6rem] text-ink outline-none" placeholder="e.g. Indiranagar, JP Nagar" />
               </div>
             
             <div className="flex gap-2">
               <button type="button" className="flex-1 bg-concrete border-2 border-ink py-2 flex items-center justify-center gap-2 text-[0.6rem] text-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)] active:shadow-none transition-all">
                 <Calendar className="w-3 h-3" /> TODAY
               </button>
               <button 
                 type="button" 
                 onClick={() => setFavorite(!favorite)}
                 className={`flex-1 border-2 border-ink py-2 flex items-center justify-center gap-2 text-[0.6rem] font-bold shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none transition-all ${favorite ? 'bg-mustard text-ink' : 'bg-concrete text-ink'}`}
               >
                 <Heart className={`w-3 h-3 ${favorite ? 'fill-ink' : ''}`} /> FAVORITE
               </button>
             </div>
           </div>
        </section>

        {/* Section 2: Bowl Details */}
        <section className="bg-white-city border-4 border-ink p-3 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative mt-2">
           <div className="absolute -top-3 left-2 bg-warm-red text-white-city text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
             BOWL DETAILS
           </div>
           
           <div className="flex flex-col gap-3 mt-2">
             
             <div>
                <label className="text-[0.5rem] text-asphalt font-bold mb-1 block">CUISINE TYPE</label>
                <select 
                  value={place.category}
                  onChange={e => setPlace({...place, category: e.target.value})}
                  className="w-full bg-cream border-2 border-ink p-2 text-[0.6rem] text-ink outline-none appearance-none cursor-pointer"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Bar & Grill">Bar & Grill</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Pan-Asian">Pan-Asian</option>
                  <option value="Indian">Indian</option>
                </select>
             </div>
           </div>
        </section>

        {/* Section 4: Journal */}
        <section className="bg-white-city border-4 border-ink p-3 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative mt-2 mb-8">
           <div className="absolute -top-3 left-2 bg-mustard text-ink text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
             JOURNAL ENTRY
           </div>
           
           <div className="flex flex-col gap-3 mt-2">
             <div>
                <label className="text-[0.5rem] text-asphalt font-bold mb-1 block">FOOD TRIED (Separate with commas for Receipt)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-cream border-2 border-ink p-2 text-[0.65rem] font-bold leading-relaxed text-ink outline-none custom-scrollbar" placeholder="e.g. Garlic Bread, Alfredo Pasta, Tiramisu"></textarea>
             </div>
             
             <div>
                <label className="text-[0.5rem] text-asphalt font-bold mb-2 block">WOULD I RETURN?</label>
                <div className="flex gap-2 h-10">
                   <button 
                     type="button" 
                     onClick={() => setWouldReturn(true)}
                     className={`flex-1 border-2 border-ink text-xs font-bold flex items-center justify-center gap-2 ${wouldReturn === true ? 'bg-leaf-green text-white-city shadow-inner' : 'bg-concrete text-ink'} active:scale-95`}
                   >
                     <Check className="w-4 h-4" /> YES
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setWouldReturn(false)}
                     className={`flex-1 border-2 border-ink text-xs font-bold flex items-center justify-center gap-2 ${wouldReturn === false ? 'bg-warm-red text-white-city shadow-inner' : 'bg-concrete text-ink'} active:scale-95`}
                   >
                     <X className="w-4 h-4" /> NO
                   </button>
                </div>
             </div>
           </div>
        </section>

      </form>

      {/* Bottom Sticky Action Bar */}
      <div className="w-full bg-cream border-t-4 border-ink p-3 shrink-0 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex gap-2">
        <Link href="/quests" className="w-1/3 bg-concrete text-ink text-xs font-bold flex items-center justify-center border-4 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none">
          CANCEL
        </Link>
        <button 
          onClick={handleSave}
          disabled={!place.name || isSaving}
          className="flex-1 bg-mustard text-ink text-xs font-bold py-3 flex items-center justify-center gap-2 border-4 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0"
        >
          {isSaving ? 'SAVING...' : <><Save className="w-4 h-4" /> SAVE TO MAP</>}
        </button>
      </div>

    </div>
  </div>
  );
}



















