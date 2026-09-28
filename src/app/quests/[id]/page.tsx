import { Heart, MapPin, Calendar, ArrowLeft, Plus, Edit2, Share2, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import realPlaces from "@/data/places.json";
import ActionButtons from "@/components/ActionButtons";

export default async function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const idStr = resolvedParams.id;

  const realPlace = realPlaces.find(p => p.id === idStr) || realPlaces[0];

  // If rating > 5, it was our fallback (e.g. 8.5). If <= 5, it's Google's (e.g. 4.2)
  let baseScore = realPlace.rating || 4.5;
  if (baseScore <= 5) {
    baseScore = baseScore * 2;
  }
  const finalScore = Math.round(baseScore * 10);

  // Dynamic mock data based on ID
  const place = {
    id: realPlace.id,
    name: realPlace.name,
    city: realPlace.city,
    neighborhood: realPlace.neighborhood,
    address: "Sunday Route",
    category: realPlace.category,
    favorite: realPlace.favorite,
    price: realPlace.price,
    tags: ["Sunday Ritual", "Good Vibes", "Memories"],
    visits: [
      { 
        id: "v1", 
        date: "2023-10-15", 
        overall_score: finalScore, 
        taste_score: 90, 
        vibe_score: 85, 
        value_score: 80, 
        notes: `Our trip to ${realPlace.name}. The vibes were great and the food was exactly what we needed this Sunday!`,
        would_return: true 
      }
    ]
  };

  const latestVisit = place.visits[0];
  const overall = (latestVisit.overall_score / 10).toFixed(1);

  // Helper for read-only stat meter
  const StatMeter = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between items-end mb-1">
        <label className="text-[0.6rem] font-bold text-ink">{label}</label>
        <span className="text-[0.6rem] font-black text-ink">{value.toFixed(1)}</span>
      </div>
      <div className="flex gap-1 h-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
          <div
            key={val}
            className={`flex-1 border border-ink ${
              val <= value ? 'bg-mustard' : 'bg-concrete/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-cream relative custom-scrollbar">
      
      {/* Storefront Banner */}
      <div className="w-full h-24 bg-brick-red shrink-0 relative border-b-4 border-ink flex items-end">
         {/* Awning stripes */}
         <div className="absolute top-0 left-0 w-full flex h-6 border-b-2 border-ink">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white-city' : 'bg-brick-red'}`}></div>
            ))}
         </div>
         {/* Back button and Title */}
         <div className="px-4 pb-2 flex gap-3 items-end w-full">
            <Link href="/quests" className="bg-white-city shrink-0 mb-0.5 p-1.5 rounded-sm border-2 border-ink text-ink flex items-center justify-center active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">
               <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-white-city flex-1 font-bold tracking-widest text-base md:text-lg drop-shadow-[2px_2px_0_rgba(38,52,58,1)] uppercase truncate">
              {place.name}
            </h1>
            <Heart className={`w-5 h-5 mb-1 shrink-0 ${place.favorite ? 'fill-mustard text-mustard drop-shadow-[2px_2px_0_rgba(38,52,58,1)]' : 'text-cream'}`} />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
        
        {/* Core Info & Giant Score */}
        <div className="flex gap-4">
           {/* Photo Frame */}
           <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 bg-asphalt border-4 border-ink rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] flex items-center justify-center">
             <span className="text-[0.6rem] font-bold text-light-sky">NO PHOTO</span>
           </div>
           
           <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="bg-light-sky border-2 border-ink px-2 py-1 inline-block mb-2">
                  <span className="text-[0.55rem] font-bold text-ink">{place.category} • {place.price}</span>
                </div>
                <div className="text-[0.55rem] text-ink flex items-center gap-1 mb-1 font-bold">
                  <MapPin className="w-3 h-3 text-brick-red shrink-0" /> <span className="truncate">{place.neighborhood}, {place.city}</span>
                </div>
              </div>

              {/* Giant Arcade Score */}
              <div className="flex items-end gap-1 mt-auto">
                 <span className="text-[0.55rem] font-bold text-asphalt pb-1">SCORE</span>
                 <span className="text-2xl md:text-3xl font-black text-warm-red drop-shadow-[2px_2px_0_rgba(38,52,58,1)] leading-none">
                   {overall}
                 </span>
              </div>
           </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
           {place.tags.map(tag => (
             <span key={tag} className="bg-white-city border border-ink text-ink text-[0.5rem] font-bold px-2 py-1 rounded-sm shadow-[1px_1px_0_rgba(38,52,58,1)]">
               #{tag.toUpperCase()}
             </span>
           ))}
        </div>

        {/* Detailed Stats Panel */}
        <div className="bg-white-city border-4 border-ink p-4 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative">
           <div className="absolute -top-3 left-2 bg-leaf-green text-white-city text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
             TASTE PROFILE
           </div>
           <div className="mt-2">
             <StatMeter label="BROTH" value={latestVisit.taste_score / 10} />
             <StatMeter label="NOODLES" value={latestVisit.vibe_score / 10} />
             <StatMeter label="TOPPINGS" value={8.5} />
             <StatMeter label="VALUE" value={latestVisit.value_score / 10} />
           </div>
        </div>

        {/* Journal Notes */}
        <div className="bg-mustard border-4 border-ink p-4 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative">
           <div className="absolute -top-3 left-2 bg-ink text-white-city text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
             PERSONAL NOTES
           </div>
           <p className="text-[0.6rem] md:text-xs leading-relaxed text-ink font-bold mt-2">
             "{latestVisit.notes}"
           </p>
           {latestVisit.would_return && (
             <div className="mt-4 flex items-center gap-1 text-leaf-green font-bold text-[0.6rem] bg-white-city border-2 border-ink inline-flex px-2 py-1">
                <CheckCircle className="w-3 h-3" /> WOULD RETURN
             </div>
           )}
        </div>

      </div>

      <ActionButtons placeName={place.name} />

    </div>
  );
}
