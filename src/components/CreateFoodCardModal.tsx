"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, RefreshCw, Star, MapPin, Check } from "lucide-react";
import { FoodCardData, CARD_THEMES, saveFoodCard, getPointsForCategory, getCategoryIcon } from "@/lib/pixelate";
import FoodCard from "@/components/FoodCard";

interface CreateFoodCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlaceName?: string;
  initialCategory?: string;
  onCardSaved?: (card: FoodCardData) => void;
}

export default function CreateFoodCardModal({
  isOpen,
  onClose,
  initialPlaceName = "",
  initialCategory = "DESSERT",
  onCardSaved,
}: CreateFoodCardModalProps) {
  const [foodName, setFoodName] = useState("");
  const [placeName, setPlaceName] = useState(initialPlaceName);
  const [category, setCategory] = useState(initialCategory.toUpperCase());
  const [rating, setRating] = useState(5);
  const [colorTheme, setColorTheme] = useState<string>("coral");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      if (initialPlaceName) setPlaceName(initialPlaceName);
      if (initialCategory) setCategory(initialCategory.toUpperCase());
      const themeKeys = Object.keys(CARD_THEMES);
      const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
      setColorTheme(randomTheme);
    }
  }, [isOpen, initialPlaceName, initialCategory]);

  const handleRandomizeTheme = () => {
    const themeKeys = Object.keys(CARD_THEMES);
    const nextTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    setColorTheme(nextTheme);
  };

  const handleSave = () => {
    if (!foodName.trim()) return;

    const newCard: FoodCardData = {
      id: "card_" + Date.now(),
      name: foodName.toUpperCase(),
      placeName: placeName.trim() || "Sunday Quest Log",
      category: category.toUpperCase() || "FOOD",
      points: getPointsForCategory(category),
      rating,
      colorTheme,
      imageUrl: getCategoryIcon(category),
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveFoodCard(newCard);
    setShowSuccess(true);

    if (onCardSaved) {
      onCardSaved(newCard);
    }

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setFoodName("");
    }, 1000);
  };

  if (!isOpen) return null;

  // Live preview card object
  const previewCard: FoodCardData = {
    id: "preview",
    name: foodName || "FOOD NAME",
    placeName: placeName || "RESTAURANT NAME",
    category: category || "DESSERT",
    points: getPointsForCategory(category),
    rating,
    colorTheme,
    imageUrl: getCategoryIcon(category),
    createdAt: "TODAY",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-2 md:p-6 font-pixel overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-cream border-4 border-ink shadow-[10px_10px_0_rgba(38,52,58,1)] flex flex-col md:flex-row max-h-[95vh] overflow-hidden rounded-sm my-auto">
        
        {/* Top Header on Mobile */}
        <div className="md:hidden bg-mustard border-b-4 border-ink p-3 flex justify-between items-center shrink-0">
          <span className="text-xs font-black text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ink" /> NEW FOOD CARD
          </span>
          <button onClick={onClose} className="p-1 bg-white-city border-2 border-ink text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Left Side: Form Controls */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
          <div className="hidden md:flex justify-between items-center pb-2 border-b-2 border-dashed border-ink/30">
            <h2 className="text-sm md:text-base font-black text-ink flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-mustard" /> CREATE FOOD CARD
            </h2>
            <span className="text-[0.6rem] bg-white-city border border-ink px-2 py-0.5 text-asphalt font-bold">
              COLLECTIBLE BADGE
            </span>
          </div>

          {/* 1. Food Name & Place */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[0.55rem] font-bold text-asphalt block mb-1">
                FOOD / DISH NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Hot Fudge Sundae"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full bg-white-city border-2 border-ink p-2 text-xs font-bold text-ink outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-asphalt/50"
              />
            </div>

            <div>
              <label className="text-[0.55rem] font-bold text-asphalt block mb-1">
                PLACE ADDED AT
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-brick-red absolute left-2" />
                <input
                  type="text"
                  placeholder="e.g. Corner House"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  className="w-full bg-white-city border-2 border-ink p-2 pl-7 text-xs font-bold text-ink outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-asphalt/50"
                />
              </div>
            </div>
          </div>

          {/* 2. Category & Rating (Points are automatic based on food type) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[0.55rem] font-bold text-asphalt">
                  FOOD TYPE
                </label>
                <span className="text-[0.55rem] font-black text-brick-red">
                  +{getPointsForCategory(category)} PTS
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 shrink-0 bg-white-city border-2 border-ink flex items-center justify-center p-0.5 shadow-[1px_1px_0_rgba(38,52,58,1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCategoryIcon(category)}
                    alt={category}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 min-w-0 bg-white-city border-2 border-ink p-2 text-[0.6rem] font-bold text-ink outline-none cursor-pointer"
                >
                  <option value="RAMEN">RAMEN (+800)</option>
                  <option value="BURGER">BURGER (+750)</option>
                  <option value="PIZZA">PIZZA (+800)</option>
                  <option value="DESSERT">DESSERT (+750)</option>
                  <option value="CAFE">CAFE (+600)</option>
                  <option value="BAKERY">BAKERY (+650)</option>
                  <option value="SNACK">SNACK (+500)</option>
                  <option value="DRINK">DRINK (+450)</option>
                  <option value="ITALIAN">ITALIAN (+850)</option>
                  <option value="JAPANESE">JAPANESE (+850)</option>
                  <option value="INDIAN">INDIAN (+850)</option>
                  <option value="MAIN">MAIN (+850)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[0.55rem] font-bold text-asphalt block mb-1">
                RATING
              </label>
              <div className="flex items-center gap-1 bg-white-city border-2 border-ink p-1.5 h-[38px] justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="focus:outline-none hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        s <= rating ? "fill-mustard text-ink" : "text-asphalt/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Card Color Theme Swatches */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[0.55rem] font-bold text-asphalt">
                CARD COLOR THEME
              </label>
              <button
                type="button"
                onClick={handleRandomizeTheme}
                className="text-[0.55rem] text-brick-red font-bold underline flex items-center gap-1 hover:text-ink"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Random
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(CARD_THEMES).map(([key, t]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColorTheme(key)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    colorTheme === key ? "scale-125 border-ink shadow-md" : "border-ink/40 hover:scale-110"
                  }`}
                  style={{ backgroundColor: t.bg }}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-concrete border-4 border-ink py-3 text-xs font-bold text-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!foodName.trim()}
              className="flex-1 bg-mustard border-4 border-ink py-3 text-xs font-bold text-ink flex items-center justify-center gap-2 active:translate-y-1 shadow-[4px_4px_0_rgba(38,52,58,1)] disabled:opacity-50 hover:brightness-105"
            >
              {showSuccess ? (
                <span className="flex items-center gap-2 text-leaf-green">
                  <Check className="w-4 h-4" /> CARD MINTED!
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-ink" /> MINT FOOD CARD
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Live Card Preview */}
        <div className="bg-[#1C2529] p-4 md:p-6 flex flex-col items-center justify-center shrink-0 border-t-4 md:border-t-0 md:border-l-4 border-ink relative overflow-hidden">
          <div className="text-[0.6rem] font-bold text-white-city/70 mb-3 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-mustard" /> LIVE CARD PREVIEW
          </div>

          <div className="w-full max-w-[340px]">
            <FoodCard card={previewCard} compact={true} />
          </div>

          <button
            onClick={onClose}
            className="hidden md:flex absolute top-3 right-3 p-1.5 bg-white-city border-2 border-ink text-ink hover:bg-concrete shadow-[2px_2px_0_rgba(38,52,58,1)]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
