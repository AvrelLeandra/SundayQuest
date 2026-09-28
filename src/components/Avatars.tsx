"use client";

import { useState } from "react";
import { Sparkles, Shirt } from "lucide-react";

export default function Avatars() {
  const [isInteracting, setIsInteracting] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  
  // Basic states to mock outfit changing
  const [outfit1, setOutfit1] = useState("bg-brand-accent/20");
  const [outfit2, setOutfit2] = useState("bg-brand-primary/20");

  const handleTap = () => {
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const cycleOutfit = (character: 1 | 2) => {
    const colors = ["bg-brand-accent/20", "bg-brand-primary/20", "bg-green-400/20", "bg-purple-400/20", "bg-yellow-400/20"];
    if (character === 1) {
      setOutfit1(prev => colors[(colors.indexOf(prev) + 1) % colors.length]);
    } else {
      setOutfit2(prev => colors[(colors.indexOf(prev) + 1) % colors.length]);
    }
  };

  return (
    <>
      <div className="flex justify-center gap-4 md:gap-2 px-2 pointer-events-none z-40 relative group">
        
        {/* Wardrobe Button */}
        <div className="absolute -top-12 md:-top-16 right-4 md:right-auto md:left-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowWardrobe(!showWardrobe)}
            className="bg-brand-secondary text-[#5c3a21] p-2 pixel-border rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
            title="Change Outfits"
          >
            <Shirt className="w-5 h-5" />
          </button>
        </div>

        {/* Real Pixel Art Characters */}
        <div className="relative pointer-events-auto cursor-pointer" onClick={handleTap}>
          {isInteracting && (
            <div className="absolute -top-12 right-0 bg-white pixel-border px-3 py-2 text-[0.6rem] rounded whitespace-nowrap animate-bounce shadow-md border-[#8b5a2b] z-50">
              <Sparkles className="w-3 h-3 inline mr-1 text-brand-secondary" />
              Time for quests!
            </div>
          )}
          
          <div className={`w-40 h-40 ${outfit1} rounded-xl flex items-end justify-center relative overflow-hidden transition-colors border-4 border-transparent hover:border-[#4cc9f0]`}>
             {/* Use the generated character sheet. mix-blend-multiply drops the white background! */}
             <img src="/avatars.jpg" className="h-[120%] max-w-none object-cover mix-blend-multiply transform translate-y-4" alt="Avatars" />
          </div>
        </div>

      </div>
    </>
  );
}
