"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Simple mock auth check using sessionStorage
    const auth = sessionStorage.getItem("sq_auth");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return <div className="w-full h-full bg-light-sky"></div>;

  return (
    <div className="w-full h-full bg-[#1e293b] flex items-center justify-center p-1 md:p-2 font-pixel overflow-hidden relative">
      
      {/* Background Container */}
      <div className="absolute inset-1 md:inset-2 border-0 md:border-[3px] border-ink rounded-none md:rounded-md overflow-hidden z-0 shadow-inner">
        <img 
          src="/bg-clean-store.png" 
          alt="Storefront Background" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Canvas Container */}
      <div className="relative w-full aspect-square md:aspect-video max-h-full max-w-full @container z-10 pointer-events-none">
        
        {/* Floating Pill Header */}
        <div className="absolute top-[4cqw] left-[4cqw] w-[92cqw] h-[8cqw] md:h-[5.5cqw] bg-cream border-[0.25cqw] border-ink rounded-[2cqw] md:rounded-[1.5cqw] p-[0.6cqw] flex justify-between items-center shadow-[0.4cqw_0.4cqw_0_rgba(38,52,58,1)] pointer-events-auto">
           <div className="flex gap-[1cqw] items-center h-full pl-[0.2cqw]">
              <div className="relative h-full aspect-square">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                  className="w-full h-full bg-mustard border-[0.25cqw] border-ink rounded-[1cqw] md:rounded-[0.8cqw] shadow-[0.2cqw_0.2cqw_0_rgba(38,52,58,1)] flex items-center justify-center active:translate-y-[0.1cqw] active:shadow-none transition-all hover:brightness-110"
                >
                  <Settings className="w-[60%] h-[60%] text-ink" />
                </button>
                {showSettings && (
                  <div className="absolute top-[120%] left-0 bg-cream border-[0.25cqw] border-ink p-[0.8cqw] shadow-[0.4cqw_0.4cqw_0_rgba(38,52,58,1)] flex flex-col z-50">
                    <button 
                      onClick={() => {
                        sessionStorage.removeItem("sq_auth");
                        router.push("/login");
                      }}
                      className="text-[1.8cqw] md:text-[1cqw] text-ink font-bold whitespace-nowrap hover:bg-concrete px-[2cqw] py-[1cqw] active:translate-y-[0.1cqw]"
                    >
                      LOG OUT
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                 <h1 className="text-[2.5cqw] md:text-[1.8cqw] text-ink font-bold tracking-widest leading-none drop-shadow-sm">SUNDAY QUEST</h1>
                 <span className="text-[1.2cqw] md:text-[0.9cqw] text-asphalt tracking-wide mt-[0.3cqw]">city food journal</span>
              </div>
           </div>
           
           <div className="h-full aspect-square bg-brick-red border-[0.25cqw] border-ink rounded-[1cqw] md:rounded-[0.8cqw] shadow-[0.2cqw_0.2cqw_0_rgba(38,52,58,1)] flex items-center justify-center mr-[0.2cqw]">
              <span className="text-white-city text-[1.5cqw] md:text-[1cqw] font-bold tracking-tighter">SQ.</span>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="absolute top-[16cqw] md:top-[14cqw] left-[4cqw] w-[92cqw] md:w-[56cqw] h-[60cqw] md:h-[40cqw] bg-cream border-[0.3cqw] border-ink rounded-[2cqw] p-[5cqw] md:p-[4cqw] flex flex-col shadow-[0.6cqw_0.6cqw_0_rgba(38,52,58,1)] pointer-events-auto">
            
            {/* Top Right Decorative Squares */}
            <div className="absolute top-[2cqw] right-[2.5cqw] flex gap-[0.4cqw]">
               <div className="w-[3cqw] md:w-[2.2cqw] h-[1.5cqw] md:h-[1.2cqw] bg-mustard border-[0.2cqw] border-ink rounded-[0.3cqw]"></div>
               <div className="w-[3cqw] md:w-[2.2cqw] h-[1.5cqw] md:h-[1.2cqw] bg-mustard border-[0.2cqw] border-ink rounded-[0.3cqw]"></div>
               <div className="w-[3cqw] md:w-[2.2cqw] h-[1.5cqw] md:h-[1.2cqw] bg-white-city border-[0.2cqw] border-ink rounded-[0.3cqw]"></div>
               <div className="w-[3cqw] md:w-[2.2cqw] h-[1.5cqw] md:h-[1.2cqw] bg-white-city border-[0.2cqw] border-ink rounded-[0.3cqw]"></div>
            </div>

            <div className="text-[1.5cqw] md:text-[0.9cqw] text-brick-red font-bold tracking-widest mb-[2cqw] md:mb-[1.5cqw] uppercase flex items-center gap-[0.5cqw] mt-0">
              SUNDAY QUEST <span className="text-brick-red text-[2cqw] md:text-[1.2cqw] leading-none">♦</span> BANGALORE
            </div>

            <h2 className="text-[7cqw] md:text-[4.5cqw] text-ink font-black leading-[1.1] mb-[0.5cqw] md:mb-[0.2cqw] tracking-wide">
              Your city,
            </h2>
            <h2 className="text-[7cqw] md:text-[4.5cqw] text-ink font-black leading-[1.1] mb-[3cqw] md:mb-[2cqw] tracking-wide">
              <span className="text-brick-red">one meal</span><br />at a time.
            </h2>

            <p className="text-[2cqw] md:text-[1.2cqw] text-ink font-medium max-w-[95%] md:max-w-[85%] leading-[1.6] font-mono mb-auto">
              A little logbook for the places, plates, and tiny moments worth remembering.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-[2cqw] md:gap-[1.8cqw] mt-auto">
              <Link href="/add" className="bg-mustard border-[0.25cqw] border-ink rounded-[1.5cqw] md:rounded-[1cqw] shadow-[0.4cqw_0.4cqw_0_rgba(38,52,58,1)] px-[3cqw] md:px-[2.5cqw] py-[2cqw] md:py-[1.2cqw] flex items-center justify-center gap-[1cqw] active:translate-y-[0.1cqw] active:shadow-none transition-all hover:brightness-110">
                <Plus className="w-[2cqw] md:w-[1.4cqw] h-[2cqw] md:h-[1.4cqw] text-ink" strokeWidth={3} />
                <span className="text-[1.8cqw] md:text-[1.1cqw] font-bold text-ink tracking-wide">Add restaurant</span>
              </Link>
              
              <Link href="/roulette" className="bg-white-city border-[0.25cqw] border-ink rounded-[1.5cqw] md:rounded-[1cqw] shadow-[0.4cqw_0.4cqw_0_rgba(38,52,58,1)] px-[3cqw] md:px-[2.5cqw] py-[2cqw] md:py-[1.2cqw] flex items-center justify-center gap-[1cqw] active:translate-y-[0.1cqw] active:shadow-none transition-all hover:bg-concrete">
                <Sparkles className="w-[2cqw] md:w-[1.4cqw] h-[2cqw] md:h-[1.4cqw] text-ink" strokeWidth={2} />
                <span className="text-[1.8cqw] md:text-[1.1cqw] font-bold text-ink tracking-wide">Quest roulette</span>
              </Link>
            </div>

            {/* Asterisk decorative sticker hanging off the side */}
            <div className="absolute top-[90%] md:top-1/2 right-[2cqw] md:-right-[2cqw] w-[6cqw] md:w-[4cqw] h-[6cqw] md:h-[4cqw] bg-mustard border-[0.3cqw] border-ink rounded-full flex items-center justify-center shadow-[0.4cqw_0.4cqw_0_rgba(38,52,58,1)] -translate-y-1/2 z-20">
               <span className="text-[3.5cqw] md:text-[2.5cqw] font-black text-ink leading-none mt-[0.6cqw]">*</span>
            </div>
         </div>
      </div>
    </div>
  );
}

