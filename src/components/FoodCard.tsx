"use client";

import React from "react";
import { Star, MapPin, Sparkles } from "lucide-react";
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
        compact ? "max-w-[270px]" : "max-w-[310px]"
      }`}
      style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.12))" }}
    >
      {/* Outer Card Body */}
      <div
        className="relative w-full rounded-[24px] md:rounded-[28px] p-3 md:p-3.5 flex flex-col justify-between overflow-hidden border-[4px] shadow-[4px_4px_0_rgba(38,52,58,0.2)]"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* Subtle Card Gloss Texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-[20px]"></div>

        {/* 1. Header Row: Category & Power Points */}
        <div className="flex justify-between items-center px-1 mb-2 z-10 gap-2">
          <span
            className="text-[0.52rem] md:text-[0.6rem] font-bold tracking-wider uppercase font-pixel truncate"
            style={{ color: theme.headerText }}
          >
            {card.category || "FOOD"}
          </span>
          <span
            className="text-[0.52rem] md:text-[0.6rem] font-bold tracking-wider font-pixel shrink-0"
            style={{ color: theme.headerText }}
          >
            + {card.points || 750}
          </span>
        </div>

        {/* 2. Photo Frame Container */}
        <div className="relative w-full aspect-[4/3] bg-[#FFFDF7] rounded-xl p-1.5 border-[2.5px] border-white/70 shadow-inner flex items-center justify-center overflow-hidden z-10 mb-2">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#F2EFE9] flex items-center justify-center">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-ink/40">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="text-[0.55rem] font-bold font-pixel">PIXEL BITE</span>
              </div>
            )}

            {/* Aesthetic watermark */}
            <span className="absolute top-1 left-1.5 text-[0.4rem] font-mono font-bold text-ink/40 pointer-events-none">
              @sunday.quest
            </span>
          </div>
        </div>

        {/* 3. Title Pill Banner & Stars */}
        <div className="flex justify-between items-center gap-1.5 mb-2 z-10">
          {/* Dish Name Pill */}
          <div
            className="px-2.5 py-0.5 rounded-full border border-black/10 shadow-sm max-w-[70%] truncate flex items-center"
            style={{ backgroundColor: theme.pillBg }}
          >
            <span
              className="text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-wide truncate"
              style={{ color: theme.pillText }}
            >
              {card.name}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3 h-3"
                style={{
                  color: star <= card.rating ? theme.starColor : theme.starEmptyColor,
                  fill: star <= card.rating ? theme.starColor : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* 4. Place Box */}
        <div
          className="rounded-xl px-2.5 py-1.5 border shadow-sm flex items-center gap-1.5 z-10"
          style={{
            backgroundColor: theme.contentBg,
            borderColor: theme.contentBorder,
          }}
        >
          <MapPin className="w-3 h-3 shrink-0" style={{ color: theme.headerText }} />
          <span
            className="text-[0.6rem] md:text-[0.65rem] font-bold truncate uppercase tracking-tight"
            style={{ color: theme.headerText }}
          >
            {card.placeName} {card.neighborhood ? `• ${card.neighborhood}` : ""}
          </span>
        </div>

        {/* 5. Footer Accents */}
        <div className="flex justify-center items-center gap-1 pt-1.5 text-center z-10">
          <span
            className="text-[0.5rem] md:text-[0.55rem] font-mono font-bold tracking-wider uppercase opacity-85"
            style={{ color: theme.footerColor }}
          >
            \ \ \ {card.footerText || "works best on the weekends"} / / /
          </span>
        </div>
      </div>
    </div>
  );
}
