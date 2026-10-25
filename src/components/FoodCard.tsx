"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";
import { FoodCardData, CARD_THEMES, getCategoryIcon } from "@/lib/pixelate";

interface FoodCardProps {
  card: FoodCardData;
  onClick?: () => void;
  compact?: boolean;
}

export default function FoodCard({ card, onClick, compact = false }: FoodCardProps) {
  const theme = CARD_THEMES[card.colorTheme] || CARD_THEMES.coral;
  const iconSrc =
    card.imageUrl && !card.imageUrl.includes(".jpg") && card.imageUrl.trim() !== ""
      ? card.imageUrl
      : getCategoryIcon(card.category);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`relative w-full select-none cursor-pointer transition-all duration-300 hover:-translate-y-1 group ${
        compact ? "max-w-[340px]" : "max-w-[370px]"
      }`}
      style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.1))" }}
    >
      {/* Outer Card Body */}
      <div
        className="relative w-full rounded-[18px] md:rounded-[20px] p-2 md:p-2.5 flex flex-col overflow-hidden border-[2.5px] md:border-[3px] shadow-[3px_3px_0_rgba(38,52,58,0.18)] gap-1"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* Subtle Card Gloss Texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-[15px]"></div>

        {/* 1. Header Row: Category & Points */}
        <div className="flex justify-between items-center px-1 z-10 font-pixel">
          <span
            className="text-[0.52rem] md:text-[0.58rem] font-bold tracking-wider uppercase truncate"
            style={{ color: theme.headerText }}
          >
            {card.category || "FOOD"}
          </span>
          <span
            className="text-[0.52rem] md:text-[0.58rem] font-bold tracking-wider shrink-0"
            style={{ color: theme.headerText }}
          >
            + {card.points || 750}
          </span>
        </div>

        {/* 2. Middle Row: Category Pixel Icon + [Dish Name Pill & Stars] */}
        <div className="flex items-center gap-2 z-10 px-0.5">
          {/* Pixel Icon */}
          <div className="relative w-11 h-11 md:w-12 md:h-12 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              alt={card.category || "food"}
              className="w-full h-full object-contain filter drop-shadow-sm select-none"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Right Column: Dish Name Pill & Stars */}
          <div className="flex-1 min-w-0 flex flex-col justify-center items-start gap-0.5">
            {/* Dish Name Pill */}
            <div
              className="px-2.5 py-0.5 md:py-1 rounded-full border border-black/15 shadow-sm max-w-full flex items-center"
              style={{ backgroundColor: theme.pillBg }}
            >
              <span
                className="font-pixel text-[0.46rem] md:text-[0.52rem] font-bold uppercase tracking-wider truncate"
                style={{ color: theme.pillText }}
                title={card.name}
              >
                {card.name}
              </span>
            </div>

            {/* Stars Row (Yellow stars with dark pixel outlines) */}
            <div className="flex items-center gap-0.5 px-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= card.rating;
                return (
                  <Star
                    key={star}
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                    stroke={isFilled ? "#1C2529" : "rgba(255, 255, 255, 0.75)"}
                    fill={isFilled ? "#FFD166" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth={1.75}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Place Tag Box (White Rounded Capsule with Pixel Text) */}
        <div className="w-full rounded-[10px] md:rounded-[12px] px-2.5 py-1 border border-black/5 shadow-sm flex items-center gap-1.5 z-10 bg-white font-pixel">
          <MapPin className="w-3 h-3 shrink-0" style={{ color: theme.headerText }} />
          <span
            className="text-[0.46rem] md:text-[0.52rem] font-bold truncate uppercase tracking-wider"
            style={{ color: theme.headerText }}
          >
            {card.placeName} {card.neighborhood ? `• ${card.neighborhood}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
