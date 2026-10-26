
"use client";

import { useState, useEffect } from "react";
import QuestCard from "@/components/QuestCard";
import ActionButtons from "@/components/ActionButtons";
import CreateFoodCardModal from "@/components/CreateFoodCardModal";
import { FoodCardData, getStoredFoodCards, getCategoryIcon } from "@/lib/pixelate";
import { Filter, Search, Plus, MapPin, Hash, ArrowDownUp, X, Star, BookOpen, Heart, Calendar, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import realPlaces from "@/data/places.json";

export default function QuestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [sortMode, setSortMode] = useState<"score-desc" | "score-asc" | "name">("score-desc");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [foodCards, setFoodCards] = useState<FoodCardData[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      if (saved.length > 0) {
        const formattedSaved = saved.map((place: any) => ({
            id: place.id,
            name: place.name,
            city: place.city,
            neighborhood: place.neighborhood,
            category: place.category,
            price: "$".repeat((place as any).price_level || 2),
            favorite: place.favorite,
            tags: place.category ? place.category.toLowerCase().split(" ") : (place.tags || []), 
            visit_count: place.visit_count || 1,
            notes: place.notes,
            would_return: place.would_return,
            visits: [
              {
                date: new Date().toISOString().split("T")[0],
                overall_score: Math.round(place.rating * 10) || 75,
                taste_score: (place.custom_ratings?.taste * 10) || 70,
                vibe_score: (place.custom_ratings?.vibe * 10) || 70,
                value_score: (place.custom_ratings?.portn * 10) || 70,
                notes: place.notes || "Added via log new quest.",
                would_return: place.would_return,
                photo_url: ""
              }
            ]
          }));
        // Append at the beginning so newly added quests show up first
        setMockPlaces(prev => {
          // Avoid duplicates if effect runs twice in dev mode
          const existingIds = new Set(prev.map(p => p.id));
          const toAdd = formattedSaved.filter((p: any) => !existingIds.has(p.id));
          return [...toAdd, ...prev];
        });
      }
    } catch(e) {}
    setFoodCards(getStoredFoodCards());
  }, []);

  const [mockPlaces, setMockPlaces] = useState<any[]>(() => (realPlaces as any[]).map((place: any, index: number) => {
    let baseScore = place.rating;
    if (baseScore <= 5) {
      baseScore = baseScore * 2;
    }
    
    return {
      id: place.id,
      name: place.name,
      city: place.city,
      neighborhood: place.neighborhood,
      category: place.category,
      price: "$".repeat((place as any).price_level || 2),
      favorite: baseScore > 8,
      tags: place.category.toLowerCase().split(" "),
      visits: [
        {
          date: `2023-${(index % 12) + 1}-15`,
          overall_score: Math.round(baseScore * 10),
          taste_score: Math.min(100, Math.round(baseScore * 10) + 5),
          vibe_score: Math.round(baseScore * 10) - 2,
          value_score: Math.round(baseScore * 10) + 2,
          notes: `Really loved the ${place.category.toLowerCase()} here. Perfect spot for a Sunday!`,
          would_return: true,
          photo_url: ""
        }
      ]
    };
  }));

  const handleAddVisit = (placeId: string) => {
    setMockPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return { ...p, visit_count: ((p as any).visit_count || 1) + 1 };
      }
      return p;
    }));
    setSelectedCard((prev: any) => {
      if (prev && prev.id === placeId) {
        return { ...prev, visit_count: (prev.visit_count || 1) + 1 };
      }
      return prev;
    });
    // Persist to local storage if custom
    const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
    const updatedLocal = localQuests.map((q: any) => q.id === placeId ? { ...q, visit_count: (q.visit_count || 1) + 1 } : q);
    localStorage.setItem("sq_custom_quests", JSON.stringify(updatedLocal));
  };

  const handleRemoveVisit = (placeId: string) => {
    setMockPlaces(prev => prev.map(p => {
      if (p.id === placeId && ((p as any).visit_count || 1) > 1) {
        return { ...p, visit_count: ((p as any).visit_count || 1) - 1 };
      }
      return p;
    }));
    setSelectedCard((prev: any) => {
      if (prev && prev.id === placeId && (prev.visit_count || 1) > 1) {
        return { ...prev, visit_count: (prev.visit_count || 1) - 1 };
      }
      return prev;
    });
    // Persist to local storage if custom
    const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
    const updatedLocal = localQuests.map((q: any) => q.id === placeId && (q.visit_count || 1) > 1 ? { ...q, visit_count: (q.visit_count || 1) - 1 } : q);
    localStorage.setItem("sq_custom_quests", JSON.stringify(updatedLocal));
  };

  const handleEditToggle = (placeId: string) => {
    if (isEditing) {
      // Save changes
      setMockPlaces(prev => prev.map(p => p.id === placeId ? { ...p, notes: editNotes } : p));
      setSelectedCard((prev: any) => prev ? { ...prev, notes: editNotes } : prev);
      
      const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const updatedLocal = localQuests.map((q: any) => q.id === placeId ? { ...q, notes: editNotes } : q);
      localStorage.setItem("sq_custom_quests", JSON.stringify(updatedLocal));
      
      setIsEditing(false);
    } else {
      setEditNotes(selectedCard.notes || selectedCard.visits?.[0]?.notes || "");
      setIsEditing(true);
    }
  };;

  const handleDeleteQuest = (placeId: string) => {
    setMockPlaces(prev => prev.filter(p => p.id !== placeId));
    const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
    const updatedLocal = localQuests.filter((q: any) => q.id !== placeId);
    localStorage.setItem("sq_custom_quests", JSON.stringify(updatedLocal));
    setSelectedCard(null);
  };

  const handleToggleLike = (placeId: string) => {
    setMockPlaces(prev => {
      const newPlaces = prev.map(p => {
        if (p.id === placeId) {
          return { ...p, favorite: !p.favorite };
        }
        return p;
      });
      const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const updatedLocal = localQuests.map((q: any) => q.id === placeId ? { ...q, favorite: !q.favorite } : q);
      localStorage.setItem("sq_custom_quests", JSON.stringify(updatedLocal));
      return newPlaces;
    });
    setSelectedCard((prev: any) => {
      if (prev && prev.id === placeId) {
        return { ...prev, favorite: !prev.favorite };
      }
      return prev;
    });
  };

  let filteredQuests = mockPlaces.filter(q => 
    q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterFavorites) {
    filteredQuests = filteredQuests.filter(q => q.favorite);
  }

  filteredQuests.sort((a, b) => {
    if (sortMode === "score-desc") {
      return (b.visits[0]?.overall_score || 0) - (a.visits[0]?.overall_score || 0);
    } else if (sortMode === "score-asc") {
      return (a.visits[0]?.overall_score || 0) - (b.visits[0]?.overall_score || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

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
              val <= value ? "bg-mustard" : "bg-concrete/30"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden relative" style={{ backgroundImage: "url('/quests_bg.jpg')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", imageRendering: "pixelated" }}>
      
      {/* Header Area */}
      <div className="m-4 mb-2 flex flex-col gap-3 shrink-0 z-10">
         <div className="flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white-city tracking-widest uppercase flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(38,52,58,1)]">
                <img src="/logbook_icon.png" alt="Logbook Icon" className="w-6 h-6 md:w-8 md:h-8 object-contain" style={{ imageRendering: "pixelated" }} /> LOGBOOK
              </h1>
              <p className="text-[0.6rem] text-white-city font-bold tracking-wider mt-0.5 opacity-90 drop-shadow-sm uppercase">
                LOGGED: {mockPlaces.length} {mockPlaces.length === 1 ? "QUEST" : "QUESTS"}
              </p>
            </div>
            <Link href="/add" className="bg-mustard border-2 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] text-ink px-3 py-1 text-[0.65rem] font-bold active:translate-y-1 active:shadow-none flex items-center gap-1 hover:brightness-105 transition-all">
              <Plus className="w-3 h-3" /> NEW QUEST
            </Link>
         </div>

         {/* Search & Filter Bar */}
         <div className="flex gap-2 h-10">
            <div className="flex-1 bg-white-city border-4 border-ink flex items-center px-2 relative group focus-within:ring-2 ring-mustard">
               <Search className="w-4 h-4 text-asphalt shrink-0" />
               <input 
                 type="text" 
                 placeholder="Search by name, neighborhood, or category..." 
                 className="w-full h-full bg-transparent outline-none px-2 text-[0.65rem] font-bold text-ink placeholder:text-asphalt/70"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            
            <button 
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`h-full px-3 border-4 border-ink flex items-center justify-center shadow-[4px_4px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none transition-colors shrink-0 ${filterFavorites ? "bg-mustard" : "bg-white-city hover:bg-concrete"}`} 
              title="Toggle Favorites Only"
            >
               <Filter className="w-4 h-4 text-ink" />
            </button>
            <button 
              onClick={() => {
                if (sortMode === "score-desc") setSortMode("score-asc");
                else if (sortMode === "score-asc") setSortMode("name");
                else setSortMode("score-desc");
              }}
              className="h-full px-3 bg-white-city border-4 border-ink flex items-center justify-center shadow-[4px_4px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none hover:bg-concrete transition-colors shrink-0" 
              title={`Sort: ${sortMode === "score-desc" ? "Highest Score" : sortMode === "score-asc" ? "Lowest Score" : "A-Z"}`}
            >
               <ArrowDownUp className="w-4 h-4 text-ink" />
            </button>
         </div>
      </div>

      {/* Grid / Empty State Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 custom-scrollbar relative z-10">
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 auto-rows-[5.5rem]">
            {filteredQuests.map(place => (
              <QuestCard 
                key={place.id} 
                place={place} 
                onClick={() => setSelectedCard(place)} 
                onToggleFavorite={(e) => { e.stopPropagation(); handleToggleLike(place.id); }}
              />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto mt-6 md:mt-8 bg-white-city/95 border-4 border-ink px-6 py-8 rounded-2xl shadow-[4px_4px_0_rgba(38,52,58,1)] flex flex-col items-center justify-center text-center">
            <h3 className="font-black text-xs md:text-sm uppercase tracking-wider mb-2 text-ink">
              {mockPlaces.length === 0 ? "NO QUESTS LOGGED YET" : "NO MATCHING QUESTS"}
            </h3>
            <p className="font-bold text-[0.65rem] text-asphalt mb-5 max-w-xs leading-relaxed">
              {mockPlaces.length === 0 ? "Start your Sunday quest journey by adding your first spot!" : "Try adjusting your search or filters."}
            </p>
            {mockPlaces.length === 0 && (
              <Link href="/add" className="bg-mustard border-2 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] text-ink px-5 py-2.5 text-[0.65rem] font-black active:translate-y-1 active:shadow-none flex items-center gap-1.5 hover:bg-[#F3D160] transition-all">
                <Plus className="w-3.5 h-3.5" /> ADD FIRST QUEST
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal Overlay (Restored Old Layout, popup style) */}
      {selectedCard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80 p-2 md:p-6 animate-in fade-in">
          
          <div className="relative w-full max-w-sm md:max-w-md h-auto max-h-[85vh] md:max-h-[80vh] bg-cream flex flex-col font-pixel border-4 border-ink rounded-3xl shadow-[8px_8px_0_rgba(38,52,58,1)] overflow-hidden animate-in zoom-in-95">
             
             {/* Storefront Banner */}
             <div className="w-full h-20 md:h-24 bg-brick-red shrink-0 relative border-b-4 border-ink flex items-end">
                {/* Awning stripes */}
                <div className="absolute top-0 left-0 w-full flex h-6 border-b-2 border-ink">
                   {[...Array(16)].map((_, i) => (
                     <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-white-city" : "bg-brick-red"}`}></div>
                   ))}
                </div>
                {/* Title and Close Button */}
                <div className="px-4 pb-2 flex justify-between items-end w-full gap-3">
                   <h1 className="text-white-city flex-1 font-bold tracking-widest text-base md:text-lg drop-shadow-[2px_2px_0_rgba(38,52,58,1)] uppercase truncate">
                     {selectedCard.name}
                   </h1>
                   <div className="flex gap-3 items-center shrink-0">
                     <button onClick={() => handleToggleLike(selectedCard.id)} className="hover:scale-110 active:scale-95 transition-transform">
                       <Heart className={`w-5 h-5 mb-1 shrink-0 ${selectedCard.favorite ? "fill-mustard text-mustard drop-shadow-[2px_2px_0_rgba(38,52,58,1)]" : "text-cream"}`} />
                     </button>
                     <button 
                       onClick={() => setSelectedCard(null)}
                       className="bg-white-city shrink-0 mb-0.5 p-1 rounded-lg border-2 border-ink text-ink flex items-center justify-center hover:bg-concrete shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none transition-all"
                     >
                       <X className="w-5 h-5" strokeWidth={3} />
                     </button>
                   </div>
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-5">
                
                {/* Core Info */}
                <div className="flex gap-4">
                   <div className="w-24 h-24 shrink-0 bg-asphalt border-4 border-ink rounded-xl shadow-[4px_4px_0_rgba(38,52,58,1)] flex items-center justify-center overflow-hidden">
                     {selectedCard.visits?.[0]?.photo_url ? (
                        <img src={selectedCard.visits[0].photo_url} alt="Food" className="w-full h-full object-cover pixelated" />
                     ) : (
                        <span className="text-[0.6rem] font-bold text-light-sky">NO PHOTO</span>
                     )}
                   </div>
                   
                   <div className="flex-1 flex flex-col justify-start">
                      <div className="bg-light-sky border-[1.5px] border-ink px-1.5 py-0.5 rounded-md inline-block mb-2 self-start">
                        <span className="text-[0.5rem] font-bold text-ink">{selectedCard.category} • {selectedCard.price}</span>
                      </div>
                      <div className="text-[0.55rem] text-ink flex items-center gap-1 font-bold mb-2">
                        <MapPin className="w-3 h-3 text-brick-red shrink-0" /> <span className="truncate">{selectedCard.neighborhood}, {selectedCard.city}</span>
                      </div>
                      
                      {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                           <span className="bg-mustard border border-ink text-ink text-[0.5rem] font-bold px-2 py-1 rounded-md shadow-[1px_1px_0_rgba(38,52,58,1)]">
                             VISITS: {selectedCard.visit_count || 1}
                           </span>
                         {selectedCard.tags.map((tag: string) => (
                           <span key={tag} className="bg-white-city border border-ink text-ink text-[0.5rem] font-bold px-2 py-1 rounded-md shadow-[1px_1px_0_rgba(38,52,58,1)]">
                             #{tag.toUpperCase()}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Journal Notes */}
                <div className="bg-white-city border-4 border-ink p-4 rounded-2xl shadow-[4px_4px_0_rgba(38,52,58,1)] relative mt-2 mb-4">
                   <div className="absolute -top-3 left-2 bg-mustard text-ink text-[0.55rem] font-bold px-2 py-1 border-2 border-ink rounded-md">
                     FOOD TRIED & NOTES
                   </div>
                   <div className="mt-2 text-xs font-bold leading-relaxed text-ink whitespace-pre-wrap">
                     {isEditing ? (
                       <textarea 
                         value={editNotes} 
                         onChange={e => setEditNotes(e.target.value)} 
                         className="w-full bg-cream border-2 border-ink p-2 outline-none custom-scrollbar text-xs font-bold" 
                         rows={4}
                       />
                     ) : (
                       selectedCard.notes || selectedCard.visits?.[0]?.notes || "No notes yet!"
                     )}
                   </div>
                   <div className="mt-4 pt-3 border-t-2 border-dashed border-ink flex items-center gap-2">
                     <span className="text-[0.6rem] font-bold text-asphalt">WOULD RETURN?</span>
                     {selectedCard.would_return === true ? (
                       <span className="bg-leaf-green text-white-city text-[0.6rem] font-bold px-2 py-0.5 rounded-md border border-ink shadow-[1px_1px_0_rgba(38,52,58,1)]">YES</span>
                     ) : selectedCard.would_return === false ? (
                       <span className="bg-warm-red text-white-city text-[0.6rem] font-bold px-2 py-0.5 rounded-md border border-ink shadow-[1px_1px_0_rgba(38,52,58,1)]">NO</span>
                     ) : (
                       <span className="bg-concrete text-ink text-[0.6rem] font-bold px-2 py-0.5 rounded-md border border-ink shadow-[1px_1px_0_rgba(38,52,58,1)]">UNDECIDED</span>
                     )}
                   </div>
                </div>

             
                {/* Food Cards for this restaurant */}
                {(() => {
                  const placeCards = foodCards.filter(
                    (c) => c.placeName.toLowerCase() === selectedCard.name.toLowerCase()
                  );
                  return (
                    <div className="bg-white-city border-4 border-ink p-3 rounded-2xl shadow-[4px_4px_0_rgba(38,52,58,1)] flex flex-col gap-2 relative mt-1 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[0.6rem] font-black text-ink flex items-center gap-1.5 uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-mustard" /> FOOD CARDS ({placeCards.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCardModalOpen(true)}
                          className="bg-mustard border-2 border-ink px-2 py-1 text-[0.55rem] font-bold text-ink rounded-md active:translate-y-0.5 shadow-[1px_1px_0_rgba(38,52,58,1)] flex items-center gap-1 hover:brightness-105"
                        >
                          <Plus className="w-3 h-3" strokeWidth={3} /> ADD FOOD CARD
                        </button>
                      </div>

                      {placeCards.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                          {placeCards.map((c) => (
                            <Link
                              key={c.id}
                              href="/cards"
                              className="flex items-center gap-2 bg-cream border-2 border-ink p-1.5 hover:bg-concrete transition-all shrink-0 shadow-[1px_1px_0_rgba(38,52,58,1)]"
                            >
                              <div className="w-7 h-7 rounded-full border-2 border-ink bg-white-city flex items-center justify-center shrink-0 shadow-[1px_1px_0_rgba(38,52,58,1)] overflow-hidden p-0.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getCategoryIcon(c.category)}
                                  alt={c.category}
                                  className="w-full h-full object-contain"
                                  style={{ imageRendering: "pixelated" }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.55rem] font-black text-ink truncate max-w-[100px]">
                                  {c.name}
                                </span>
                                <span className="text-[0.45rem] text-asphalt font-bold">
                                  {c.category} • +{c.points}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[0.5rem] text-asphalt font-bold py-1">
                          <span>No food cards minted yet!</span>
                          <button
                            type="button"
                            onClick={() => setIsCardModalOpen(true)}
                            className="text-brick-red underline hover:text-ink font-bold"
                          >
                            + Pixelate dish photo
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>

             <ActionButtons 
                 placeName={selectedCard.name} 
                 onAddVisit={() => handleAddVisit(selectedCard.id)} 
                 onRemoveVisit={() => handleRemoveVisit(selectedCard.id)}
                 onDelete={() => handleDeleteQuest(selectedCard.id)}
                 onEdit={() => handleEditToggle(selectedCard.id)}
                 isEditing={isEditing}
               />
      {/* Create Food Card Modal */}
      {selectedCard && (
        <CreateFoodCardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          initialPlaceName={selectedCard.name}
          initialCategory={selectedCard.category}
          onCardSaved={() => setFoodCards(getStoredFoodCards())}
        />
      )}


          </div>
        </div>
      )}

    </div>
  );
}





































