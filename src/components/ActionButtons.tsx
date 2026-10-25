
"use client";

import { Edit2, Share2, Plus, Trash2, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActionButtons({ placeName, onAddVisit, onRemoveVisit, onDelete, onEdit, isEditing }: { placeName: string, onAddVisit?: () => void, onRemoveVisit?: () => void, onDelete?: () => void, onEdit?: () => void, isEditing?: boolean }) {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: placeName,
          text: `Check out ${placeName} on Sunday Quest!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete your records for ${placeName}?`)) {
      if (onDelete) {
        onDelete();
      } else {
        router.push("/quests");
      }
    }
  };

  return (
    <div className="w-full bg-cream border-t-4 border-ink p-3 shrink-0 z-40 flex gap-2 h-[4.5rem]">
      <button 
        onClick={onEdit}
        className={`flex-1 ${isEditing ? "bg-mustard" : "bg-white-city"} text-ink text-[0.45rem] md:text-[0.6rem] leading-none font-bold flex flex-col items-center justify-center h-full border-4 border-ink rounded-xl shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none whitespace-nowrap`}
      >
        <Edit2 className="w-4 h-4 mb-1" /> {isEditing ? "SAVE" : "EDIT"}
      </button>
      <button 
        onClick={handleShare}
        className="flex-1 bg-white-city text-ink text-[0.45rem] md:text-[0.6rem] leading-none font-bold flex flex-col items-center justify-center h-full border-4 border-ink rounded-xl shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none whitespace-nowrap"
      >
        <Share2 className="w-4 h-4 mb-1" /> SHARE
      </button>
      
      <div className="flex-[1.2] flex gap-1 h-full">
        <button 
          onClick={() => onAddVisit ? onAddVisit() : router.push("/add")}
          className="flex-1 bg-mustard text-ink text-[0.45rem] md:text-[0.6rem] leading-none font-bold flex flex-col items-center justify-center h-full border-4 border-ink rounded-xl shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mb-1" /> ADD
        </button>
        {onRemoveVisit && (
          <button 
            onClick={onRemoveVisit}
            title="Remove last visit"
            className="w-7 shrink-0 bg-warm-red text-white-city flex flex-col items-center justify-center h-full border-4 border-ink rounded-xl shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
      </div>

      <button 
        onClick={handleDelete}
        className="flex-1 bg-warm-red text-white-city text-[0.45rem] md:text-[0.6rem] leading-none font-bold flex flex-col items-center justify-center h-full border-4 border-ink rounded-xl shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-1 active:shadow-none whitespace-nowrap"
      >
        <Trash2 className="w-4 h-4 mb-1" /> DELETE
      </button>
    </div>
  );
}




