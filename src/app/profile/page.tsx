"use client";

import { User, Trophy, Flame, MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [player, setPlayer] = useState<"Avrel" | "Aurel">("Avrel");

  useEffect(() => {
    const auth = sessionStorage.getItem("sq_auth");
    if (auth === "sister") {
      setPlayer("Aurel");
    } else {
      setPlayer("Avrel");
    }
  }, []);

  const playerData = {
    Avrel: {
      level: 5,
      streak: 4,
      totalQuests: 12,
      title: "Sunday Adventurer",
      sprite: "/avrel/idle_01.png",
      stats: { cafe: 8, restaurant: 9, dessert: 4 }
    },
    Aurel: {
      level: 7,
      streak: 8,
      totalQuests: 21,
      title: "Master Foodie",
      sprite: "/aurel/idle_01.png",
      stats: { cafe: 6, restaurant: 10, dessert: 8 }
    }
  };

  const current = playerData[player];

  const StatMeter = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col mb-3 w-full">
      <div className="flex justify-between items-end mb-1">
        <label className="text-[0.55rem] font-bold text-ink tracking-wide">{label}</label>
        <span className="text-[0.55rem] font-black text-ink">Lv.{value}</span>
      </div>
      <div className="flex gap-1 h-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
          <div
            key={val}
            className={`flex-1 border-2 border-ink ${
              val <= value ? "bg-leaf-green shadow-[1px_1px_0_rgba(38,52,58,1)]" : "bg-concrete/30"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const sharedStreak = 0; // Shared across both players

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-light-sky">
      
      {/* Header */}
      <div className="bg-deep-green border-b-4 border-ink p-4 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl text-white-city font-bold tracking-widest flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(38,52,58,1)]">
            <User className="w-6 h-6 text-mustard" /> PLAYER
          </h1>
          <p className="text-[0.6rem] text-white-city font-bold mt-1 opacity-80">YOUR EXPLORER IDENTITY</p>
        </div>
        
        </div><div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-12 flex flex-col gap-4 items-center">
         
         {/* ID CARD */}
         <div className="w-full max-w-sm bg-cream border-4 border-ink p-4 shadow-[6px_6px_0_rgba(38,52,58,1)] relative">
            <div className="absolute -top-3 -right-3 bg-warm-red text-white-city text-[0.6rem] font-bold px-2 py-1 border-4 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] rotate-3">
              ID: {player.toUpperCase()}
            </div>

            <div className="flex gap-4 items-start">
               {/* Avatar Frame - Cropped slightly to show chest up */}
               <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 bg-window-blue border-4 border-ink shadow-inner flex items-center justify-center overflow-hidden">
                 <img 
                   src={current.sprite} 
                   alt={player} 
                   className={`w-full h-full object-contain pixelated ${player === "Aurel" ? "scale-[0.8]" : "scale-100"}`} 
                   style={{ imageRendering: "pixelated" }} 
                 />
               </div>

               <div className="flex flex-col gap-1 w-full mt-1">
                  <h2 className="text-xl md:text-2xl font-black text-ink uppercase leading-none tracking-wide">{player}</h2>
                  <p className="text-[0.6rem] text-asphalt font-bold uppercase">{current.title}</p>
                  
                  <div className="mt-2 bg-light-sky border-2 border-ink p-2 flex flex-col gap-2">
                     <div className="flex justify-between items-center text-[0.55rem] font-bold text-ink">
                       <span className="flex items-center gap-1"><Star className="w-3 h-3 text-mustard" /> LEVEL</span>
                       <span className="text-lg leading-none">{current.level}</span>
                     </div>
                     <div className="flex justify-between items-center text-[0.55rem] font-bold text-ink">
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brick-red" /> QUESTS</span>
                       <span className="text-lg leading-none">{current.totalQuests}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Streaks & Fire */}
         <div className="w-full max-w-sm bg-white-city border-4 border-ink p-3 shadow-[6px_6px_0_rgba(38,52,58,1)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] ${sharedStreak > 0 ? "bg-warm-red" : "bg-concrete"}`}>
                 <Flame className={`w-5 h-5 ${sharedStreak > 0 ? "text-mustard fill-mustard animate-pulse" : "text-asphalt fill-asphalt"}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold text-asphalt">SUNDAY STREAK</span>
                <span className={`text-xl font-black leading-none ${sharedStreak > 0 ? "text-warm-red" : "text-asphalt"}`}>{sharedStreak} WEEKS</span>
              </div>
            </div>
            <div className={`text-[0.5rem] font-bold px-2 py-1 border-2 border-ink ${sharedStreak > 0 ? "bg-mustard text-ink" : "bg-concrete text-asphalt"}`}>
              {sharedStreak > 0 ? "ON FIRE!" : "NOT STARTED"}
            </div>
         </div>

         {/* EXP Stats */}
         <div className="w-full max-w-sm bg-cream border-4 border-ink p-4 shadow-[6px_6px_0_rgba(38,52,58,1)] relative mt-2">
            <div className="absolute -top-3 left-3 bg-leaf-green text-white-city text-[0.6rem] font-bold px-2 py-1 border-4 border-ink shadow-[2px_2px_0_rgba(38,52,58,1)]">
              EXPERIENCE
            </div>
            <div className="mt-3 flex flex-col gap-2">
               <StatMeter label="CAFE EXPLORER" value={current.stats.cafe} />
               <StatMeter label="RESTAURANT CRITIC" value={current.stats.restaurant} />
               <StatMeter label="DESSERT HUNTER" value={current.stats.dessert} />
            </div>
         </div>

      </div>
    </div>
  );
}



