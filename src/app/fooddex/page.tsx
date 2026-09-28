"use client";

import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import realPlaces from "@/data/places.json";

export default function FoodDexPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Simulate some places being undiscovered
  const dexEntries = realPlaces.map((place, i) => ({
    ...place,
    discovered: i % 4 !== 3, // Make 1 in 4 places "undiscovered" for the demo
    dexNumber: (i + 1).toString().padStart(3, "0")
  }));

  const categories = Array.from(new Set(realPlaces.map(p => p.category)));

  // Filter logic
  const filteredEntries = dexEntries.filter(entry => {
    const matchesCategory = activeCategory === "ALL" || entry.category === activeCategory;
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-light-sky">
      {/* Header */}
      <div className="bg-deep-green border-b-4 border-ink p-4 shrink-0">
        <h1 className="text-xl md:text-2xl text-white-city font-bold tracking-widest flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(38,52,58,1)]">
          <BookOpen className="w-6 h-6 text-mustard" /> FOOD DEX
        </h1>
        <p className="text-[0.6rem] text-white-city font-bold mt-1 opacity-80">GOTTA EAT EM ALL</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="flex gap-2">
           <div className="flex-1 bg-white-city border-4 border-ink p-2 flex items-center gap-2 shadow-[2px_2px_0_rgba(38,52,58,1)] focus-within:bg-cream transition-colors">
             <Search className="w-4 h-4 text-asphalt" />
             <input 
               type="text" 
               placeholder="SEARCH DEX..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-none w-full text-[0.6rem] md:text-xs font-bold text-ink uppercase placeholder:text-asphalt"
             />
           </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar shrink-0">
          <button 
            onClick={() => setActiveCategory("ALL")}
            className={`px-3 py-1 text-[0.55rem] font-bold border-2 border-ink shrink-0 transition-colors uppercase ${activeCategory === "ALL" ? "bg-ink text-white-city" : "bg-white-city text-ink hover:bg-concrete"}`}
          >
            ALL
          </button>
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1 text-[0.55rem] font-bold border-2 border-ink shrink-0 transition-colors uppercase ${activeCategory === c ? "bg-ink text-white-city" : "bg-white-city text-ink hover:bg-concrete"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Dex Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 content-start mt-4 px-1 md:px-2">
           {filteredEntries.map((entry) => (
             <div 
               key={entry.id} 
               className={`flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 cursor-pointer ${!entry.discovered ? "opacity-50 grayscale" : ""}`}
             >
               {/* Image Ticket with Overlay Text */}
               <div className="relative w-full aspect-[1.5] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img 
                    src="/ticket_blank.png" 
                    alt="Ticket" 
                    className="absolute inset-0 w-full h-full object-cover pixelated" 
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  
                  {/* Text Overlay - Constrained strictly to the red inner box */}
                  <div className="absolute top-[20%] bottom-[20%] left-[30%] right-[30%] z-10 flex flex-col items-center justify-center text-center">
                    {entry.discovered ? (
                      <div className="text-[0.45rem] md:text-[0.5rem] font-black text-[#5e2b17] uppercase text-center leading-[1.1] line-clamp-3 w-full whitespace-normal break-words">
                        {entry.name}
                      </div>
                    ) : (
                      <div className="text-3xl md:text-4xl font-black text-[#5e2b17]/40 text-center">?</div>
                    )}
                  </div>
               </div>

               {/* Dex Number Below */}
               <div className="mt-1 md:mt-2">
                 {entry.discovered && (
                   <span className="text-[0.55rem] md:text-[0.6rem] font-black text-asphalt uppercase bg-white-city border-2 border-ink px-2 py-0.5">
                     #{entry.dexNumber}
                   </span>
                 )}
               </div>
             </div>
           ))}
           
           {filteredEntries.length === 0 && (
             <div className="col-span-2 md:col-span-4 text-center py-8">
               <p className="text-[0.6rem] md:text-xs font-bold text-asphalt uppercase">NO ENTRIES FOUND.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

