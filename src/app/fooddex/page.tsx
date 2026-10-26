"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Plus } from "lucide-react";
import Link from "next/link";
import realPlaces from "@/data/places.json";

export default function FoodDexPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPlaces, setAllPlaces] = useState<any[]>(() => realPlaces);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const deleted = new Set(JSON.parse(localStorage.getItem("sq_deleted_quests") || "[]"));
      const savedNames = new Set(saved.map((s: any) => s.name?.toLowerCase().trim()));
      const filteredPlaces = (realPlaces as any[]).filter(
        (p) => !deleted.has(p.id) && !savedNames.has(p.name?.toLowerCase().trim())
      );
      setAllPlaces([...saved, ...filteredPlaces]);
    } catch (e) {}
  }, []);

  const dexEntries = allPlaces.map((place, i) => ({
    ...place,
    discovered: true,
    dexNumber: (i + 1).toString().padStart(3, "0")
  }));

  const categories = Array.from(new Set(allPlaces.map((p) => p.category).filter(Boolean)));

  // Filter logic
  const filteredEntries = dexEntries.filter((entry) => {
    const matchesCategory = activeCategory === "ALL" || entry.category === activeCategory;
    const matchesSearch = entry.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-light-sky">
      {/* Header */}
      <div className="bg-deep-green border-b-4 border-ink p-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl text-white-city font-bold tracking-widest flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(38,52,58,1)]">
            <BookOpen className="w-6 h-6 text-mustard" /> FOOD DEX
          </h1>
          <p className="text-[0.6rem] text-white-city font-bold mt-1 opacity-80">
            {allPlaces.length} ENTRIES LOGGED
          </p>
        </div>
        <Link
          href="/add"
          className="bg-mustard border-2 border-ink px-3 py-1 text-[0.65rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> NEW QUEST
        </Link>
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
        {categories.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar shrink-0">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-3 py-1 text-[0.55rem] font-bold border-2 border-ink shrink-0 transition-colors uppercase ${
                activeCategory === "ALL" ? "bg-ink text-white-city" : "bg-white-city text-ink hover:bg-concrete"
              }`}
            >
              ALL
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 text-[0.55rem] font-bold border-2 border-ink shrink-0 transition-colors uppercase ${
                  activeCategory === c ? "bg-ink text-white-city" : "bg-white-city text-ink hover:bg-concrete"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Dex Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 content-start mt-2 px-1 md:px-2">
          {filteredEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/quests/${entry.id}`}
              className="flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Image Ticket with Overlay Text */}
              <div className="relative w-full aspect-[1.5] flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/ticket_blank.png"
                  alt="Ticket"
                  className="absolute inset-0 w-full h-full object-cover pixelated"
                  style={{ mixBlendMode: "multiply" }}
                />

                {/* Text Overlay - Constrained strictly to the red inner box */}
                <div className="absolute top-[20%] bottom-[20%] left-[30%] right-[30%] z-10 flex flex-col items-center justify-center text-center">
                  <div className="text-[0.45rem] md:text-[0.5rem] font-black text-[#5e2b17] uppercase text-center leading-[1.1] line-clamp-3 w-full whitespace-normal break-words">
                    {entry.name}
                  </div>
                </div>
              </div>

              {/* Dex Number Below */}
              <div className="mt-1 md:mt-2">
                <span className="text-[0.55rem] md:text-[0.6rem] font-black text-asphalt uppercase bg-white-city border-2 border-ink px-2 py-0.5">
                  #{entry.dexNumber}
                </span>
              </div>
            </Link>
          ))}

          {filteredEntries.length === 0 && (
            <div className="col-span-2 md:col-span-4 text-center py-12 flex flex-col items-center justify-center bg-white-city/80 border-4 border-ink p-6 rounded-xl shadow-[4px_4px_0_rgba(38,52,58,1)]">
              <p className="text-[0.7rem] md:text-xs font-black text-ink uppercase mb-1">
                {allPlaces.length === 0 ? "NO FOOD DEX ENTRIES YET" : "NO MATCHING ENTRIES"}
              </p>
              <p className="text-[0.6rem] text-asphalt font-bold mb-4">
                {allPlaces.length === 0
                  ? "Log your first quest to begin filling your Food Dex!"
                  : "Try searching with a different keyword or category."}
              </p>
              {allPlaces.length === 0 && (
                <Link
                  href="/add"
                  className="bg-mustard border-2 border-ink px-4 py-2 text-[0.65rem] font-black text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5"
                >
                  + ADD FIRST QUEST
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
