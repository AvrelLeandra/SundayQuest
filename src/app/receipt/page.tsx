"use client";

import { useState, useEffect } from "react";
import { Store, Sun, Flame, Heart, CakeSlice, CupSoda } from "lucide-react";
import realPlaces from "@/data/places.json";

export default function ReceiptPage() {
  const [stats, setStats] = useState({
    places: 50,
    foods: 0,
    sundays: 52,
    streak: 5
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      
      let foodCount = 0;
      saved.forEach((q: any) => {
        if (q.notes) {
          // Count items separated by commas
          const items = q.notes.split(",").filter((item: string) => item.trim().length > 0);
          // If they didn't use commas but wrote something, at least count it as 1
          foodCount += items.length > 0 ? items.length : (q.notes.length > 3 ? 1 : 0);
        }
      });

      setStats({
        places: realPlaces.length + saved.length,
        foods: foodCount,
        sundays: 52 + saved.length,
        streak: 5 + (saved.length > 0 ? 1 : 0)
      });
    } catch (e) {}
  }, []);

  const textDark = "text-[#3E2522]";
  const borderDark = "border-[#3E2522]";
  const pink = "text-[#F18F95]";

  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center overflow-y-auto custom-scrollbar py-2 px-4 relative"
      style={{
        backgroundImage: "url('/receipt_bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        imageRendering: "pixelated"
      }}
    >
      <div className="absolute inset-0 bg-ink/20 pointer-events-none"></div>
      
      {/* Receipt Container */}
      <div className="w-full max-w-[340px] relative z-10 drop-shadow-[8px_8px_0_rgba(62,37,34,0.4)] flex flex-col">
        
        {/* Top Scalloped Edge */}
        <div 
          className="w-full h-3 bg-[#FAF2E8]"
          style={{
            maskImage: "radial-gradient(circle at 6px 0px, transparent 3px, black 4px)",
            maskSize: "12px 12px",
            maskRepeat: "repeat-x",
            WebkitMaskImage: "radial-gradient(circle at 6px 0px, transparent 3px, black 4px)",
            WebkitMaskSize: "12px 12px",
            WebkitMaskRepeat: "repeat-x",
          }}
        />

        {/* Receipt Body */}
        <div className="w-full bg-[#FAF2E8] flex flex-col px-6 py-4 border-l-4 border-r-4 border-[#3E2522]">
          
          {/* Header */}
          <div className="flex justify-between items-start w-full mb-2 md:mb-4">
            <div className={`text-[0.55rem] font-bold uppercase leading-tight ${textDark}`}>
              SUNDAY<br/>QUEST
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[#F6CD61] text-xs">✨</span>
              <CakeSlice className="w-5 h-5 md:w-6 md:h-6 text-[#EF7C8E] fill-[#EF7C8E] mt-1" strokeWidth={1.5} />
            </div>
            <div className={`text-[0.45rem] font-bold uppercase leading-tight text-right ${textDark}`}>
              GOOD FOOD<br/>BETTER<br/>COMPANY<br/>
              <Heart className={`w-2 h-2 inline-block ${textDark} fill-current`} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-2 md:mb-4">
            <h1 className={`text-2xl font-black uppercase tracking-widest flex justify-center items-center gap-2 ${textDark}`}>
              <Heart className={`w-4 h-4 ${pink} fill-current`} />
              OUR JOURNEY
              <Heart className={`w-4 h-4 ${pink} fill-current`} />
            </h1>
            <p className={`text-[0.55rem] font-bold tracking-[0.2em] mt-1 ${textDark}`}>
              SMALL PLACES ✦ BIG MEMORIES
            </p>
          </div>

          {/* Dashed Line */}
          <div className={`w-full border-t-2 border-dashed ${borderDark} opacity-30 mb-2 md:mb-3`}></div>

          {/* Stats List */}
          <div className="flex flex-col gap-2 md:gap-3">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-white-city border-2 border-[#3E2522] rounded-sm flex items-center justify-center shadow-[2px_2px_0_#3E2522]">
                <Store className="w-5 h-5 md:w-6 md:h-6 text-[#F6CD61] fill-[#F6CD61]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className={`text-[0.55rem] font-bold uppercase tracking-wider ${textDark}`}>Places Visited</div>
                <div className={`text-2xl md:text-3xl font-black leading-none ${textDark}`}>{stats.places}</div>
              </div>
              <div className={`text-[0.45rem] font-bold uppercase text-right leading-tight opacity-70 ${textDark}`}>
                MORE PLACES<br/>MORE FLAVOURS<br/>MORE US<br/>
                <Heart className="w-2 h-2 inline-block fill-current mt-0.5" />
              </div>
            </div>

            <div className={`w-full border-t-2 border-dashed ${borderDark} opacity-30`}></div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-white-city border-2 border-[#3E2522] rounded-sm flex items-center justify-center shadow-[2px_2px_0_#3E2522]">
                <span className="text-xl">🧁</span>
              </div>
              <div className="flex-1">
                <div className={`text-[0.55rem] font-bold uppercase tracking-wider ${textDark}`}>Foods Discovered</div>
                <div className={`text-2xl md:text-3xl font-black leading-none ${textDark}`}>{stats.foods}</div>
              </div>
              <div className={`text-[0.45rem] font-bold uppercase text-right leading-tight opacity-70 ${textDark}`}>
                GOOD FOOD<br/>GOOD MOOD<br/>
                <Heart className="w-2 h-2 inline-block fill-current mt-0.5" />
              </div>
            </div>

            <div className={`w-full border-t-2 border-dashed ${borderDark} opacity-30`}></div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-white-city border-2 border-[#3E2522] rounded-sm flex items-center justify-center shadow-[2px_2px_0_#3E2522]">
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-[#F6CD61] fill-[#F6CD61]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className={`text-[0.55rem] font-bold uppercase tracking-wider ${textDark}`}>Sundays Explored</div>
                <div className={`text-2xl md:text-3xl font-black leading-none ${textDark}`}>{stats.sundays}</div>
              </div>
              <div className={`text-[0.45rem] font-bold uppercase text-right leading-tight opacity-70 ${textDark}`}>
                SAME GIRLS<br/>NEW PLACES<br/>
                <Heart className="w-2 h-2 inline-block fill-current mt-0.5" />
              </div>
            </div>

            <div className={`w-full border-t-2 border-dashed ${borderDark} opacity-30`}></div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-white-city border-2 border-[#3E2522] rounded-sm flex items-center justify-center shadow-[2px_2px_0_#3E2522]">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-[#EF7C8E] fill-[#EF7C8E]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className={`text-[0.55rem] font-bold uppercase tracking-wider ${textDark}`}>Current Streak</div>
                <div className={`text-2xl md:text-3xl font-black leading-none ${textDark}`}>{stats.streak}</div>
              </div>
              <div className={`text-[0.45rem] font-bold uppercase text-right leading-tight opacity-70 ${textDark}`}>
                KEEP THE<br/>QUEST ALIVE<br/>
                <Heart className="w-2 h-2 inline-block fill-current mt-0.5" />
              </div>
            </div>

          </div>

          <div className={`w-full border-t-2 ${borderDark} mt-3 mb-2`}></div>

          {/* Footer */}
          <div className="text-center mb-1 flex flex-col items-center">
             <div className={`text-[0.6rem] font-bold tracking-widest uppercase mb-3 ${textDark}`}>
               <span className="text-[#F6CD61]">✦</span> QUEST CONTINUES... <span className="text-[#F6CD61]">✦</span>
             </div>
             <div className={`flex items-center gap-2 text-[0.6rem] opacity-50 ${textDark} mb-1`}>
                - - - - - <Heart className={`w-3 h-3 ${pink} fill-current`} /> - - - - -
             </div>
          </div>
          
        </div>

        {/* Bottom Scalloped Edge */}
        <div 
          className="w-full h-3 bg-[#FAF2E8]"
          style={{
            maskImage: "radial-gradient(circle at 6px 12px, transparent 3px, black 4px)",
            maskSize: "12px 12px",
            maskRepeat: "repeat-x",
            WebkitMaskImage: "radial-gradient(circle at 6px 12px, transparent 3px, black 4px)",
            WebkitMaskSize: "12px 12px",
            WebkitMaskRepeat: "repeat-x",
          }}
        />

      </div>
    </div>
  );
}






