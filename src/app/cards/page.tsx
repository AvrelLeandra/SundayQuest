"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Search, Trash2, X, Download, Share2, Layers } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import CreateFoodCardModal from "@/components/CreateFoodCardModal";
import { FoodCardData, getStoredFoodCards, deleteFoodCard } from "@/lib/pixelate";

export default function CardsPage() {
  const [cards, setCards] = useState<FoodCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedCard, setSelectedCard] = useState<FoodCardData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setCards(getStoredFoodCards());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this food card from your collection?")) {
      const updated = deleteFoodCard(id);
      setCards(updated);
      setSelectedCard(null);
    }
  };

  const categories = ["ALL", ...Array.from(new Set(cards.map((c) => c.category)))];

  const filteredCards = cards.filter((card) => {
    const matchesCategory =
      activeCategory === "ALL" || card.category.toUpperCase() === activeCategory.toUpperCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      card.name.toLowerCase().includes(query) ||
      card.placeName.toLowerCase().includes(query) ||
      (card.neighborhood && card.neighborhood.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="w-full h-full flex flex-col font-pixel overflow-hidden relative"
      style={{
        backgroundImage: "url('/quests_bg.jpg')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    >
      {/* Top Header */}
      <div className="m-4 mb-2 flex flex-col gap-3 shrink-0 z-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white-city tracking-widest uppercase flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(38,52,58,1)]">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-mustard" /> FOOD CARDS
            </h1>
            <p className="text-[0.6rem] text-white-city font-bold tracking-wider mt-0.5 opacity-90 drop-shadow-sm">
              COLLECTED: {cards.length} MEMORIES
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-mustard border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] text-ink px-3 py-2 text-[0.65rem] md:text-xs font-bold active:translate-y-1 active:shadow-none flex items-center gap-1.5 hover:brightness-105 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> NEW FOOD CARD
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white-city border-4 border-ink flex items-center px-2 shadow-[2px_2px_0_rgba(38,52,58,1)] focus-within:ring-2 ring-mustard">
            <Search className="w-4 h-4 text-asphalt shrink-0" />
            <input
              type="text"
              placeholder="Search by food name or restaurant..."
              className="w-full h-10 bg-transparent outline-none px-2 text-[0.65rem] font-bold text-ink placeholder:text-asphalt/60 uppercase"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[0.55rem] md:text-[0.6rem] font-bold uppercase border-2 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5 whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-ink text-white-city" : "bg-white-city text-ink hover:bg-concrete"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-12 pt-2 custom-scrollbar z-10">
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 justify-items-center">
            {filteredCards.map((card) => (
              <FoodCard
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center bg-cream/90 border-4 border-dashed border-ink/30 p-6 text-center my-6">
            <Layers className="w-12 h-12 text-ink/30 mb-3" />
            <h3 className="text-sm font-black text-ink uppercase mb-1">NO FOOD CARDS FOUND</h3>
            <p className="text-[0.65rem] text-asphalt font-bold mb-4">
              Add your first pixel food card to start your collection!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-mustard border-4 border-ink px-4 py-2 text-xs font-bold text-ink shadow-[3px_3px_0_rgba(38,52,58,1)] active:translate-y-1"
            >
              + CREATE FIRST CARD
            </button>
          </div>
        )}
      </div>

      {/* Card Detail / Inspector Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 font-pixel animate-in fade-in">
          <div className="relative flex flex-col items-center max-w-sm w-full animate-in zoom-in-95">
            {/* Close Button at top */}
            <div className="w-full flex justify-end mb-2">
              <button
                onClick={() => setSelectedCard(null)}
                className="bg-white-city border-2 border-ink p-1.5 text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] hover:bg-concrete"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            {/* The Full Card */}
            <FoodCard card={selectedCard} />

            {/* Actions Bar */}
            <div className="w-full bg-cream border-4 border-ink p-3 shadow-[6px_6px_0_rgba(38,52,58,1)] flex gap-2 mt-4 rounded-sm">
              <button
                onClick={() => handleDelete(selectedCard.id)}
                className="flex-1 bg-warm-red text-white-city border-2 border-ink py-2 text-[0.6rem] font-bold flex items-center justify-center gap-1.5 active:translate-y-0.5 shadow-[2px_2px_0_rgba(38,52,58,1)]"
              >
                <Trash2 className="w-3.5 h-3.5" /> DELETE
              </button>

              {selectedCard.imageUrl && (
                <a
                  href={selectedCard.imageUrl}
                  download={`${selectedCard.name.toLowerCase().replace(/\s+/g, "_")}_pixel.png`}
                  className="flex-1 bg-leaf-green text-white-city border-2 border-ink py-2 text-[0.6rem] font-bold flex items-center justify-center gap-1.5 active:translate-y-0.5 shadow-[2px_2px_0_rgba(38,52,58,1)]"
                >
                  <Download className="w-3.5 h-3.5" /> SAVE PIC
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      <CreateFoodCardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCardSaved={(newCard) => {
          setCards(getStoredFoodCards());
        }}
      />
    </div>
  );
}
