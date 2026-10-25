"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Sparkles, RefreshCw, Star, MapPin, Check, Sliders } from "lucide-react";
import { FoodCardData, CARD_THEMES, pixelateImage, saveFoodCard, getPointsForCategory } from "@/lib/pixelate";
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
  const [footerText, setFooterText] = useState("works best on the weekends");
  const [colorTheme, setColorTheme] = useState<string>("coral");

  // Image & Pixelation states
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [pixelatedImageSrc, setPixelatedImageSrc] = useState<string>("");
  const [pixelResolution, setPixelResolution] = useState<number>(44);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      if (initialPlaceName) setPlaceName(initialPlaceName);
      if (initialCategory) setCategory(initialCategory.toUpperCase());
      // Pick a random pleasant theme
      const themeKeys = Object.keys(CARD_THEMES);
      const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
      setColorTheme(randomTheme);
    }
  }, [isOpen, initialPlaceName, initialCategory]);

  // Re-pixelate when image or resolution changes
  useEffect(() => {
    if (!rawImageSrc) return;
    let isCancelled = false;
    setIsProcessing(true);

    pixelateImage(rawImageSrc, pixelResolution).then((pixelResult) => {
      if (!isCancelled) {
        setPixelatedImageSrc(pixelResult);
        setIsProcessing(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [rawImageSrc, pixelResolution]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setRawImageSrc(src);
    };
    reader.readAsDataURL(file);
  };

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
      footerText: footerText.trim(),
      colorTheme,
      imageUrl: pixelatedImageSrc || rawImageSrc || "/food_ticket.jpg",
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
      // Reset form
      setFoodName("");
      setRawImageSrc(null);
      setPixelatedImageSrc("");
    }, 1200);
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
    footerText,
    colorTheme,
    imageUrl: pixelatedImageSrc || rawImageSrc || "",
    createdAt: "TODAY",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-2 md:p-6 font-pixel overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-cream border-4 border-ink shadow-[10px_10px_0_rgba(38,52,58,1)] flex flex-col md:flex-row max-h-[95vh] overflow-hidden rounded-sm my-auto">
        
        {/* Top Header on Mobile */}
        <div className="md:hidden bg-mustard border-b-4 border-ink p-3 flex justify-between items-center shrink-0">
          <span className="text-xs font-black text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ink" /> NEW PIXEL FOOD CARD
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
              PIXEL COLLECTIBLE
            </span>
          </div>

          {/* 1. Food Photo Upload & Pixelation Slider */}
          <div className="bg-white-city border-4 border-ink p-3 shadow-[2px_2px_0_rgba(38,52,58,1)]">
            <label className="text-[0.6rem] font-bold text-asphalt mb-1.5 flex justify-between items-center">
              <span>FOOD PHOTO</span>
              {rawImageSrc && (
                <span className="text-leaf-green flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> PIXELATED
                </span>
              )}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-light-sky border-2 border-ink py-2.5 px-3 flex items-center justify-center gap-2 text-ink text-[0.65rem] font-bold hover:bg-sky-blue active:translate-y-0.5 shadow-[2px_2px_0_rgba(38,52,58,1)]"
              >
                <Upload className="w-4 h-4" />
                {rawImageSrc ? "CHANGE PHOTO" : "UPLOAD FOOD PICTURE"}
              </button>
            </div>

            {/* Pixel Resolution Slider */}
            {rawImageSrc && (
              <div className="mt-3 pt-2 border-t border-dashed border-ink/20 flex flex-col gap-1">
                <div className="flex justify-between text-[0.55rem] font-bold text-ink">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> PIXEL DETAIL:
                  </span>
                  <span className="text-brick-red">
                    {pixelResolution < 32 ? "RETRO 8-BIT" : pixelResolution < 55 ? "COZY PIXEL" : "CRISP"}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="4"
                  value={pixelResolution}
                  onChange={(e) => setPixelResolution(Number(e.target.value))}
                  className="w-full accent-brick-red cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 2. Food Name & Place */}
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

          {/* 3. Category & Rating (Points are automatic based on food type) */}
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white-city border-2 border-ink p-2 text-[0.65rem] font-bold text-ink outline-none cursor-pointer"
              >
                <option value="DESSERT">DESSERT (+750)</option>
                <option value="MAIN">MAIN (+850)</option>
                <option value="PIZZA">PIZZA (+800)</option>
                <option value="RAMEN">RAMEN (+800)</option>
                <option value="BURGER">BURGER (+750)</option>
                <option value="CAFE">CAFE (+600)</option>
                <option value="BAKERY">BAKERY (+650)</option>
                <option value="SNACK">SNACK (+500)</option>
                <option value="DRINK">DRINK (+450)</option>
                <option value="ITALIAN">ITALIAN (+850)</option>
                <option value="JAPANESE">JAPANESE (+850)</option>
                <option value="INDIAN">INDIAN (+850)</option>
              </select>
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

          {/* 4. Card Color Theme Swatches */}
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
              disabled={!foodName.trim() || isProcessing}
              className="flex-1 bg-mustard border-4 border-ink py-3 text-xs font-bold text-ink flex items-center justify-center gap-2 active:translate-y-1 shadow-[4px_4px_0_rgba(38,52,58,1)] disabled:opacity-50 hover:brightness-105"
            >
              {showSuccess ? (
                <span className="flex items-center gap-2 text-leaf-green">
                  <Check className="w-4 h-4" /> CARD MINTED!
                </span>
              ) : isProcessing ? (
                "PIXELATING..."
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

          <div className="w-full max-w-[270px]">
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
