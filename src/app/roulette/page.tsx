"use client";

import { useState, useEffect } from "react";
import { Sparkles, Dices, ArrowRight, RefreshCw, X, MapPin } from "lucide-react";
import Link from "next/link";
import places from "@/data/places.json";

export default function RoulettePage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [allPlaces, setAllPlaces] = useState<any[]>(() => places);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const deleted = new Set(JSON.parse(localStorage.getItem("sq_deleted_quests") || "[]"));
      const savedNames = new Set(saved.map((s: any) => s.name?.toLowerCase().trim()));
      const filteredPlaces = (places as any[]).filter(
        (p) => !deleted.has(p.id) && !savedNames.has(p.name?.toLowerCase().trim())
      );
      setAllPlaces([...saved, ...filteredPlaces]);
    } catch (e) {}
  }, []);

  const spinRoulette = () => {
    if (allPlaces.length === 0) return;
    setSpinning(true);
    setResult(null);

    // Total spin duration
    const duration = 2500;
    const interval = 80;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setDisplayIndex(Math.floor(Math.random() * allPlaces.length));

      if (elapsed >= duration) {
        clearInterval(timer);
        const finalPlace = allPlaces[Math.floor(Math.random() * allPlaces.length)];
        setResult(finalPlace);
        setSpinning(false);
      }
    }, interval);
  };

  const displayedPlace = result || (allPlaces.length > 0 ? allPlaces[displayIndex % allPlaces.length] : null);

  return (
    <div className="w-full h-full flex flex-col font-pixel bg-cream relative overflow-hidden">
      {/* Header */}
      <div className="bg-ink text-white-city p-4 shrink-0 flex items-center justify-between z-20">
        <h1 className="text-sm font-bold tracking-widest flex items-center gap-2">
          <Dices className="w-5 h-5 text-mustard" /> QUEST ROULETTE
        </h1>
        <Link
          href="/"
          className="bg-white-city/20 p-2 rounded-sm border border-white-city/30 hover:bg-white-city/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Title */}
        {!result && !spinning && (
          <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl text-ink font-black leading-tight mb-2">
              DON'T KNOW
              <br />
              WHERE TO EAT?
            </h2>
            <p className="text-[0.6rem] text-asphalt font-bold">
              {allPlaces.length > 0 ? "Let the city decide your fate." : "Add some quests to your logbook to spin!"}
            </p>
          </div>
        )}

        {/* The Roulette Machine */}
        <div
          className={`w-full max-w-sm bg-white-city border-8 border-ink p-6 relative transition-all duration-300 ${
            spinning
              ? "scale-105 shadow-[0_0_20px_rgba(241,200,75,0.8)]"
              : "shadow-[8px_8px_0_rgba(38,52,58,1)]"
          }`}
        >
          {/* Top Lights */}
          <div className="absolute -top-4 left-0 w-full flex justify-around px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 border-ink ${
                  spinning ? "bg-warm-red animate-pulse" : "bg-concrete"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>

          {/* Screen */}
          <div className="w-full h-32 bg-ink border-4 border-ink flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>

            {spinning && displayedPlace ? (
              <div className="text-center z-20 flex flex-col items-center">
                <span className="text-[0.6rem] text-mustard font-bold block mb-1 opacity-80 animate-pulse">
                  SEARCHING...
                </span>
                <h3 className="text-lg md:text-xl text-white-city font-black truncate w-full px-2 text-center">
                  {displayedPlace.name?.toUpperCase()}
                </h3>
              </div>
            ) : result ? (
              <div className="text-center z-20 animate-in zoom-in duration-300 flex flex-col items-center">
                <span className="text-[0.5rem] bg-brick-red text-white-city px-2 py-0.5 border border-white-city mb-2 inline-block shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  MATCH FOUND!
                </span>
                <h3 className="text-xl md:text-2xl text-mustard font-black line-clamp-2 leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  {result.name?.toUpperCase()}
                </h3>
                <span className="text-[0.55rem] text-light-sky mt-2 flex items-center justify-center gap-1 font-bold">
                  <MapPin className="w-3 h-3" /> {(result.neighborhood || result.city || "CITY")?.toUpperCase()}
                </span>
              </div>
            ) : allPlaces.length === 0 ? (
              <div className="text-center z-20 flex flex-col items-center">
                <span className="text-[0.6rem] text-mustard font-bold block mb-1">
                  NO PLACES LOGGED
                </span>
                <h3 className="text-base text-white-city font-black tracking-widest uppercase">EMPTY LOGBOOK</h3>
              </div>
            ) : (
              <div className="text-center z-20 opacity-50 flex flex-col items-center">
                <h3 className="text-xl text-white-city font-black tracking-widest">???</h3>
              </div>
            )}
          </div>

          {/* Details Reveal */}
          <div
            className={`mt-4 flex gap-2 justify-center transition-all duration-500 overflow-hidden ${
              result ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {result?.category && (
              <div className="bg-light-sky border-2 border-ink px-2 py-1 text-[0.55rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)]">
                {result.category}
              </div>
            )}
            {result && (
              <div className="bg-leaf-green border-2 border-ink px-2 py-1 text-[0.55rem] font-bold text-white-city shadow-[2px_2px_0_rgba(38,52,58,1)]">
                SCORE: {result.rating ? (result.rating > 5 ? result.rating : (result.rating * 2).toFixed(1)) : "8.0"}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 md:mt-12 flex flex-col gap-4 w-full max-w-sm">
          {allPlaces.length === 0 ? (
            <Link
              href="/add"
              className="w-full bg-mustard border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] py-4 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all hover:bg-[#F3D160]"
            >
              <Sparkles className="w-5 h-5 text-ink fill-ink" />
              <span className="text-sm font-bold text-ink tracking-widest">+ ADD FIRST QUEST</span>
            </Link>
          ) : !result && !spinning ? (
            <button
              onClick={spinRoulette}
              className="w-full bg-mustard border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] py-4 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all hover:bg-[#F3D160]"
            >
              <Sparkles className="w-5 h-5 text-ink fill-ink" />
              <span className="text-sm font-bold text-ink tracking-widest">SPIN THE WHEEL</span>
            </button>
          ) : result ? (
            <>
              <Link
                href={`/quests/${result.id}`}
                className="w-full bg-mustard border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] py-3 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none hover:bg-[#F3D160]"
              >
                <span className="text-xs font-bold text-ink tracking-widest">VIEW QUEST</span>
                <ArrowRight className="w-4 h-4 text-ink" />
              </Link>
              <button
                onClick={spinRoulette}
                className="w-full bg-white-city border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] py-3 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none hover:bg-concrete"
              >
                <RefreshCw className="w-4 h-4 text-ink" />
                <span className="text-xs font-bold text-ink tracking-widest">SPIN AGAIN</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
