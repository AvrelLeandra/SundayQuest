"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, MapPin, Calendar, ArrowLeft, Plus, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import realPlaces from "@/data/places.json";
import ActionButtons from "@/components/ActionButtons";
import CreateFoodCardModal from "@/components/CreateFoodCardModal";
import { FoodCardData, getStoredFoodCards, getCategoryIcon, isPlaceMatch } from "@/lib/pixelate";
import { Sparkles } from "lucide-react";

export default function RestaurantDetail() {
  const router = useRouter();
  const params = useParams();
  const idStr = (params?.id as string) || "";

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [foodCards, setFoodCards] = useState<FoodCardData[]>([]);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    setFoodCards(getStoredFoodCards());
    const refresh = () => setFoodCards(getStoredFoodCards());
    window.addEventListener("storage", refresh);
    window.addEventListener("sq_cards_updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("sq_cards_updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    try {
      // 1. Try finding in custom quests first
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const foundCustom = saved.find((p: any) => String(p.id) === String(idStr));
      if (foundCustom) {
        let baseScore = foundCustom.rating || 0;
        if (baseScore <= 5 && baseScore > 0) baseScore = baseScore * 2;
        const finalScore = baseScore ? Math.round(baseScore * 10) : 80;
        
        setPlace({
          id: foundCustom.id,
          name: foundCustom.name,
          city: foundCustom.city || "Bangalore",
          neighborhood: foundCustom.neighborhood || "City Center",
          address: "Sunday Route",
          category: foundCustom.category || "Restaurant",
          favorite: !!foundCustom.favorite,
          price: "$".repeat(foundCustom.price_level || 2),
          tags: foundCustom.tags && foundCustom.tags.length > 0 
            ? foundCustom.tags 
            : [foundCustom.category || "Food", "Sunday Ritual"],
          visits: [
            {
              id: "v1",
              date: new Date().toISOString().split("T")[0],
              overall_score: finalScore,
              taste_score: Math.round((foundCustom.custom_ratings?.taste || 7.5) * 10),
              vibe_score: Math.round((foundCustom.custom_ratings?.vibe || 7.5) * 10),
              value_score: Math.round((foundCustom.custom_ratings?.portn || 7.5) * 10),
              notes: foundCustom.notes || `Our visit to ${foundCustom.name}.`,
              would_return: foundCustom.would_return ?? true
            }
          ]
        });
        setLoading(false);
        return;
      }

      // 2. Try finding in places.json
      const foundReal = (realPlaces as any[]).find((p: any) => String(p.id) === String(idStr));
      if (foundReal) {
        let baseScore = foundReal.rating || 4.5;
        if (baseScore <= 5) baseScore = baseScore * 2;
        const finalScore = Math.round(baseScore * 10);

        setPlace({
          id: foundReal.id,
          name: foundReal.name,
          city: foundReal.city,
          neighborhood: foundReal.neighborhood,
          address: "Sunday Route",
          category: foundReal.category,
          favorite: !!foundReal.favorite,
          price: foundReal.price || "$$",
          tags: ["Sunday Ritual", "Good Vibes", "Memories"],
          visits: [
            {
              id: "v1",
              date: "2023-10-15",
              overall_score: finalScore,
              taste_score: 90,
              vibe_score: 85,
              value_score: 80,
              notes: `Our trip to ${foundReal.name}. The vibes were great and the food was delicious!`,
              would_return: true
            }
          ]
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [idStr]);

  const handleDelete = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const updated = saved.filter((p: any) => String(p.id) !== String(idStr));
      localStorage.setItem("sq_custom_quests", JSON.stringify(updated));
      const deleted = JSON.parse(localStorage.getItem("sq_deleted_quests") || "[]");
      if (!deleted.includes(idStr)) {
        deleted.push(idStr);
        localStorage.setItem("sq_deleted_quests", JSON.stringify(deleted));
      }
      import("@/lib/sync").then(({ deleteQuestFromCloud }) => {
        deleteQuestFromCloud(idStr).catch(() => {});
      });
    } catch (e) {}
    router.push("/quests");
  };

  const handleToggleFavorite = () => {
    if (!place) return;
    const nextFav = !place.favorite;
    setPlace((prev: any) => ({ ...prev, favorite: nextFav }));
    try {
      const saved = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
      const updated = saved.map((p: any) => String(p.id) === String(idStr) ? { ...p, favorite: nextFav } : p);
      localStorage.setItem("sq_custom_quests", JSON.stringify(updated));
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center font-pixel bg-cream">
        <p className="text-xs font-bold text-ink animate-pulse uppercase tracking-widest">LOADING QUEST...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-pixel bg-cream p-6 text-center">
        <div className="bg-white-city border-4 border-ink p-6 rounded-xl shadow-[4px_4px_0_rgba(38,52,58,1)] max-w-sm w-full">
          <Search className="w-8 h-8 text-asphalt mx-auto mb-2 opacity-60" />
          <h2 className="text-base font-black text-ink uppercase mb-1">Quest Not Found</h2>
          <p className="text-[0.65rem] font-bold text-asphalt mb-4">This quest may have been removed or doesn't exist.</p>
          <Link
            href="/quests"
            className="inline-flex items-center gap-1 bg-mustard border-2 border-ink px-4 py-2 text-[0.65rem] font-black text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO LOGBOOK
          </Link>
        </div>
      </div>
    );
  }

  const latestVisit = place.visits[0];
  const overall = (latestVisit.overall_score / 10).toFixed(1);

  // Helper for read-only stat meter
  const StatMeter = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between items-end mb-1">
        <label className="text-[0.6rem] font-bold text-ink">{label}</label>
        <span className="text-[0.6rem] font-black text-ink">{value.toFixed(1)}</span>
      </div>
      <div className="flex gap-1 h-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
          <div
            key={val}
            className={`flex-1 border border-ink ${
              val <= value ? "bg-mustard" : "bg-concrete/30"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-pixel overflow-hidden bg-cream relative custom-scrollbar">
      {/* Storefront Banner */}
      <div className="w-full h-24 bg-brick-red shrink-0 relative border-b-4 border-ink flex items-end">
        {/* Awning stripes */}
        <div className="absolute top-0 left-0 w-full flex h-6 border-b-2 border-ink">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-white-city" : "bg-brick-red"}`}></div>
          ))}
        </div>
        {/* Back button and Title */}
        <div className="px-4 pb-2 flex gap-3 items-end w-full">
          <Link
            href="/quests"
            className="bg-white-city shrink-0 mb-0.5 p-1.5 rounded-sm border-2 border-ink text-ink flex items-center justify-center active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-white-city flex-1 font-bold tracking-widest text-base md:text-lg drop-shadow-[2px_2px_0_rgba(38,52,58,1)] uppercase truncate">
            {place.name}
          </h1>
          <button
            onClick={handleToggleFavorite}
            className="hover:scale-110 active:scale-95 transition-transform"
            title="Toggle favorite"
          >
            <Heart
              className={`w-5 h-5 mb-1 shrink-0 ${
                place.favorite
                  ? "fill-mustard text-mustard drop-shadow-[2px_2px_0_rgba(38,52,58,1)]"
                  : "text-cream"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
        {/* Core Info & Giant Score */}
        <div className="flex gap-4">
          {/* Photo Frame */}
          <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 bg-asphalt border-4 border-ink rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] flex items-center justify-center">
            <span className="text-[0.6rem] font-bold text-light-sky">NO PHOTO</span>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="bg-light-sky border-2 border-ink px-2 py-1 inline-block mb-2">
                <span className="text-[0.55rem] font-bold text-ink">
                  {place.category} • {place.price}
                </span>
              </div>
              <div className="text-[0.55rem] text-ink flex items-center gap-1 mb-1 font-bold">
                <MapPin className="w-3 h-3 text-brick-red shrink-0" />{" "}
                <span className="truncate">
                  {place.neighborhood}, {place.city}
                </span>
              </div>
            </div>

            {/* Giant Arcade Score */}
            <div className="flex items-end gap-1 mt-auto">
              <span className="text-[0.55rem] font-bold text-asphalt pb-1">SCORE</span>
              <span className="text-2xl md:text-3xl font-black text-warm-red drop-shadow-[2px_2px_0_rgba(38,52,58,1)] leading-none">
                {overall}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {place.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-white-city border border-ink text-ink text-[0.5rem] font-bold px-2 py-1 rounded-sm shadow-[1px_1px_0_rgba(38,52,58,1)]"
            >
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Detailed Stats Panel */}
        <div className="bg-white-city border-4 border-ink p-4 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative">
          <div className="absolute -top-3 left-2 bg-leaf-green text-white-city text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
            TASTE PROFILE
          </div>
          <div className="mt-2">
            <StatMeter label="BROTH / BASE" value={latestVisit.taste_score / 10} />
            <StatMeter label="VIBE / AMBIANCE" value={latestVisit.vibe_score / 10} />
            <StatMeter label="TOPPINGS / SIDES" value={8.5} />
            <StatMeter label="VALUE FOR MONEY" value={latestVisit.value_score / 10} />
          </div>
        </div>

        {/* Journal Notes */}
        <div className="bg-mustard border-4 border-ink p-4 rounded-sm shadow-[4px_4px_0_rgba(38,52,58,1)] relative">
          <div className="absolute -top-3 left-2 bg-ink text-white-city text-[0.55rem] font-bold px-2 py-1 border-2 border-ink">
            PERSONAL NOTES
          </div>
          <p className="text-[0.6rem] md:text-xs leading-relaxed text-ink font-bold mt-2">
            "{latestVisit.notes}"
          </p>
          {latestVisit.would_return && (
            <div className="mt-4 flex items-center gap-1 text-leaf-green font-bold text-[0.6rem] bg-white-city border-2 border-ink inline-flex px-2 py-1">
              <CheckCircle className="w-3 h-3" /> WOULD RETURN
            </div>
          )}
        </div>
        {/* Food Cards for this restaurant */}
        {(() => {
          const placeCards = foodCards.filter((c) =>
            isPlaceMatch(c.placeName, place.name)
          );
          return (
            <div className="bg-white-city border-4 border-ink p-3 rounded-2xl shadow-[4px_4px_0_rgba(38,52,58,1)] flex flex-col gap-2 relative mt-1 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.6rem] font-black text-ink flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-mustard" /> FOOD CARDS ({placeCards.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(true)}
                  className="bg-mustard border-2 border-ink px-2 py-1 text-[0.55rem] font-bold text-ink rounded-md active:translate-y-0.5 shadow-[1px_1px_0_rgba(38,52,58,1)] flex items-center gap-1 hover:brightness-105"
                >
                  <Plus className="w-3 h-3" strokeWidth={3} /> ADD FOOD CARD
                </button>
              </div>

              {placeCards.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {placeCards.map((c) => (
                    <Link
                      key={c.id}
                      href="/cards"
                      className="flex items-center gap-2 bg-cream border-2 border-ink p-1.5 hover:bg-concrete transition-all shrink-0 shadow-[1px_1px_0_rgba(38,52,58,1)]"
                    >
                      <div className="w-7 h-7 rounded-full border-2 border-ink bg-white-city flex items-center justify-center shrink-0 shadow-[1px_1px_0_rgba(38,52,58,1)] overflow-hidden p-0.5">
                        <img
                          src={getCategoryIcon(c.category)}
                          alt={c.category}
                          className="w-full h-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.55rem] font-black text-ink truncate max-w-[100px]">
                          {c.name}
                        </span>
                        <span className="text-[0.45rem] text-asphalt font-bold">
                          {c.category} • +{c.points}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between text-[0.5rem] text-asphalt font-bold py-1">
                  <span>No food cards minted yet!</span>
                  <button
                    type="button"
                    onClick={() => setIsCardModalOpen(true)}
                    className="text-brick-red underline hover:text-ink font-bold"
                  >
                    + Pixelate dish photo
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <ActionButtons placeName={place.name} onDelete={handleDelete} />

      {/* Create Food Card Modal */}
      <CreateFoodCardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setFoodCards(getStoredFoodCards());
        }}
        initialPlaceName={place.name}
        initialCategory={place.category}
        onCardSaved={() => setFoodCards(getStoredFoodCards())}
      />
    </div>
  );
}
