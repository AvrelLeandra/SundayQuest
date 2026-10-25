"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";
import { FoodCardData, CARD_THEMES } from "@/lib/pixelate";

interface FoodCardProps {
  card: FoodCardData;
  onClick?: () => void;
  compact?: boolean;
}

export default function FoodCard({ card, onClick, compact = false }: FoodCardProps) {
  const theme = CARD_THEMES[card.colorTheme] || CARD_THEMES.coral;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`relative w-full select-none cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group font-sans ${
        compact ? "max-w-[270px]" : "max-w-[320px]"
      }`}
      style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.12))" }}
    >
      {/* Outer Card Body */}
      <div
        className="relative w-full rounded-[22px] md:rounded-[26px] p-3.5 md:p-4 flex flex-col justify-between overflow-hidden border-[4px] shadow-[4px_4px_0_rgba(38,52,58,0.2)] gap-2.5"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* Subtle Card Gloss Texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-[18px]"></div>

        {/* 1. Header Row: Category & Points */}
        <div className="flex justify-between items-center px-0.5 z-10 gap-2">
          <span
            className="text-[0.55rem] md:text-[0.62rem] font-bold tracking-wider uppercase font-pixel truncate"
            style={{ color: theme.headerText }}
          >
            {card.category || "FOOD"}
          </span>
          <span
            className="text-[0.55rem] md:text-[0.62rem] font-bold tracking-wider font-pixel shrink-0"
            style={{ color: theme.headerText }}
          >
            + {card.points || 750}
          </span>
        </div>

        {/* 2. Dish Name Banner & Stars */}
        <div className="flex justify-between items-center gap-2 z-10 py-1">
          {/* Dish Name Pill */}
          <div
            className="px-3 py-1.5 rounded-full border border-black/10 shadow-sm flex-1 truncate flex items-center"
            style={{ backgroundColor: theme.pillBg }}
          >
            <span
              className="text-[0.7rem] md:text-[0.78rem] font-black uppercase tracking-wider truncate"
              style={{ color: theme.pillText }}
            >
              {card.name}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 shrink-0 bg-white/40 px-2 py-1 rounded-full border border-black/5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5"
                style={{
                  color: star <= card.rating ? theme.starColor : theme.starEmptyColor,
                  fill: star <= card.rating ? theme.starColor : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* 3. Place Tag Box */}
        <div
          className="rounded-xl px-2.5 py-2 border shadow-sm flex items-center gap-1.5 z-10"
          style={{
            backgroundColor: theme.contentBg,
            borderColor: theme.contentBorder,
          }}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.headerText }} />
          <span
            className="text-[0.62rem] md:text-[0.68rem] font-bold truncate uppercase tracking-tight"
            style={{ color: theme.headerText }}
          >
            {card.placeName} {card.neighborhood ? `• ${card.neighborhood}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
