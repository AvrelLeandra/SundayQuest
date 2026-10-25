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
      className={`relative w-full select-none cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group font-sans ${
        compact ? "max-w-[285px]" : "max-w-[315px]"
      }`}
      style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.12))" }}
    >
      {/* Outer Card Body */}
      <div
        className="relative w-full rounded-[24px] md:rounded-[28px] p-3.5 md:p-4 flex flex-col justify-between overflow-hidden border-[3.5px] shadow-[4px_4px_0_rgba(38,52,58,0.2)] gap-2.5"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* Subtle Card Gloss Texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-[20px]"></div>

        {/* 1. Header Row: Category & Points */}
        <div className="flex justify-between items-center px-1 z-10">
          <span
            className="text-[0.6rem] md:text-[0.68rem] font-black tracking-wider uppercase font-pixel truncate"
            style={{ color: theme.headerText }}
          >
            {card.category || "FOOD"}
          </span>
          <span
            className="text-[0.6rem] md:text-[0.68rem] font-black tracking-wider font-pixel shrink-0"
            style={{ color: theme.headerText }}
          >
            + {card.points || 750}
          </span>
        </div>

        {/* 2. Middle Row: Category Pixel Icon + [Dish Name Pill & Stars] */}
        <div className="flex items-center gap-3 z-10 px-0.5 my-0.5">
          {/* Pixel Icon */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              alt={card.category || "food"}
              className="w-full h-full object-contain filter drop-shadow-sm select-none"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Right Column: Dish Name Pill & Stars */}
          <div className="flex-1 min-w-0 flex flex-col justify-center items-start gap-1.5">
            {/* Dish Name Pill */}
            <div
              className="px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm max-w-full flex items-center"
              style={{ backgroundColor: theme.pillBg }}
            >
              <span
                className="text-[0.68rem] md:text-[0.75rem] font-black uppercase tracking-wider truncate"
                style={{ color: theme.pillText }}
                title={card.name}
              >
                {card.name}
              </span>
            </div>

            {/* Stars Row (Yellow stars with crisp amber borders like reference mockup) */}
            <div className="flex items-center gap-1 px-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= card.rating;
                return (
                  <Star
                    key={star}
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                    stroke={isFilled ? "#B45309" : "rgba(255, 255, 255, 0.75)"}
                    fill={isFilled ? "#FACC15" : "rgba(255, 255, 255, 0.25)"}
                    strokeWidth={1.5}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Place Tag Box (White Rounded Capsule) */}
        <div className="w-full rounded-[16px] md:rounded-2xl px-3.5 py-2 border border-black/5 shadow-sm flex items-center gap-2 z-10 bg-white">
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.headerText }} />
          <span
            className="text-[0.62rem] md:text-[0.68rem] font-bold truncate uppercase tracking-wider"
            style={{ color: theme.headerText }}
          >
            {card.placeName} {card.neighborhood ? `• ${card.neighborhood}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
