import { Heart } from "lucide-react";

export default function QuestCard({ place, onClick, onToggleFavorite }: { place: any, onClick?: () => void, onToggleFavorite?: (e: React.MouseEvent) => void }) {
  const latestVisit = place.visits?.[0] || {};
  

  return (
    <div 
      onClick={onClick} 
      className="w-full h-full min-h-[4.5rem] bg-[#cb5b5b] rounded-2xl shadow-[4px_4px_0_rgba(38,52,58,1)] border-4 border-ink p-2 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
    >
      <div className="flex items-start max-w-[90%]">
        <span className="text-[0.65rem] text-white-city font-bold tracking-widest uppercase line-clamp-2 leading-tight">
          {place.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2 absolute bottom-2 right-2 shrink-0">
        
        <button 
          onClick={onToggleFavorite} 
          className="hover:scale-110 active:scale-95 transition-transform"
        >
          <Heart className={place.favorite ? "w-4 h-4 fill-mustard text-ink" : "w-4 h-4 text-ink"} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

