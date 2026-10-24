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
      className={`relative w-full select-none cursor-pointer transition-all duration-300 hover:-translate-y-2 group ${
        compact ? "max-w-[280px]" : "max-w-[340px]"
      }`}
      style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.12))" }}
    >
      {/* Outer Card Body */}
      <div
        className="relative w-full rounded-[28px] md:rounded-[32px] p-3.5 md:p-4.5 flex flex-col justify-between overflow-hidden border-[5px] transition-shadow duration-300 shadow-[6px_6px_0_rgba(38,52,58,0.2)]"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
          minHeight: compact ? "380px" : "460px",
        }}
      >
        {/* Subtle Card Shine / Texture Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 pointer-events-none rounded-[24px]"></div>

        {/* 1. Header Row: Category & Power Points */}
        <div className="flex justify-between items-center px-1 mb-2.5 z-10">
          <span
            className="text-xs md:text-sm font-black tracking-widest uppercase"
            style={{ color: theme.headerText }}
          >
            {card.category || "FOOD"}
          </span>
          <span
            className="text-xs md:text-sm font-black tracking-wider flex items-center gap-1"
            style={{ color: theme.headerText }}
          >
            + {card.points || 750}
          </span>
        </div>

        {/* 2. Photo Frame Container */}
        <div className="relative w-full aspect-[4/3] bg-[#FFFDF7] rounded-2xl p-2 border-[3px] border-white/60 shadow-inner flex items-center justify-center overflow-hidden z-10">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F2EFE9] flex items-center justify-center">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-ink/40">
                <Sparkles className="w-8 h-8 animate-pulse" />
                <span className="text-[0.6rem] font-bold">PIXEL BITE</span>
              </div>
            )}

            {/* Aesthetic watermark */}
            <span className="absolute top-1.5 left-2 text-[0.45rem] font-mono font-bold text-ink/40 pointer-events-none">
              @sunday.quest
            </span>
          </div>
        </div>

        {/* 3. Title Pill Banner & Stars */}
        <div className="flex justify-between items-center gap-2 mt-3 mb-2 z-10">
          {/* Dish Name Pill */}
          <div
            className="px-3 py-1 rounded-full border border-black/10 shadow-sm max-w-[70%] truncate flex items-center"
            style={{ backgroundColor: theme.pillBg }}
          >
            <span
              className="text-[0.65rem] md:text-[0.7rem] font-black uppercase tracking-wider truncate"
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
                className="w-3.5 h-3.5"
                style={{
                  color: star <= card.rating ? theme.starColor : theme.starEmptyColor,
                  fill: star <= card.rating ? theme.starColor : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* 4. Description & Place Story Box */}
        <div
          className="rounded-2xl p-2.5 md:p-3 border shadow-sm flex flex-col justify-between gap-2 z-10"
          style={{
            backgroundColor: theme.contentBg,
            borderColor: theme.contentBorder,
          }}
        >
          {/* Power Text */}
          <p
            className="text-[0.6rem] md:text-[0.68rem] leading-relaxed font-medium line-clamp-3"
            style={{ color: theme.textColor }}
          >
            {card.power.startsWith("power:") ? card.power : `power: ${card.power}`}
          </p>

          {/* Place Tag */}
          <div
            className="flex items-center gap-1.5 pt-1.5 border-t border-dashed"
            style={{ borderColor: theme.contentBorder }}
          >
            <MapPin className="w-3 h-3 shrink-0" style={{ color: theme.headerText }} />
            <span
              className="text-[0.55rem] md:text-[0.62rem] font-bold truncate uppercase tracking-wide"
              style={{ color: theme.headerText }}
            >
              Found at: {card.placeName} {card.neighborhood ? `• ${card.neighborhood}` : ""}
            </span>
          </div>
        </div>

        {/* 5. Footer Accents */}
        <div className="flex justify-center items-center gap-1.5 pt-2 text-center z-10">
          <span
            className="text-[0.55rem] md:text-[0.6rem] font-mono font-bold tracking-widest uppercase opacity-90"
            style={{ color: theme.footerColor }}
          >
            \ \ \ {card.footerText || "works best on the weekends"} / / /
          </span>
        </div>
      </div>
    </div>
  );
}
