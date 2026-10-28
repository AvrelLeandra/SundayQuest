"use client";

import { usePathname } from 'next/navigation';
import Navigation from "@/components/Navigation";
import React, { useEffect } from 'react';
import { syncAllWithCloud, initRealtimeSync } from "@/lib/sync";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Background Cloud Sync & Live Realtime listener across all devices
  useEffect(() => {
    // 1. Initial background sync on app load
    syncAllWithCloud().catch(() => {});

    // 2. Realtime listener for cross-device updates
    const cleanupRealtime = initRealtimeSync();

    // 3. Re-sync whenever user switches back to the tab/app
    const handleFocus = () => {
      syncAllWithCloud().catch(() => {});
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        syncAllWithCloud().catch(() => {});
      }
    });

    return () => {
      cleanupRealtime();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Hide navigation on the player selection splash screen (login)
  const isSplashPage = pathname === '/login';

  if (isSplashPage) {
    return (
      <div className="w-full h-full flex flex-col relative bg-cream overflow-hidden">
         <main className="flex-1 w-full h-full overflow-y-auto">
            {children}
         </main>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Container */}
      <div className="hidden md:flex w-full h-full mx-auto p-4 md:p-6 gap-6 items-center justify-center">
        
        {/* Left Navigation Rail */}
        <div className="w-48 lg:w-56 h-full shrink-0">
          <Navigation />
        </div>

        {/* Central Content Area */}
        <div className="flex-1 h-full bg-cream border-4 border-ink shadow-[8px_8px_0_rgba(38,52,58,1)] overflow-hidden flex flex-col relative rounded-sm">
           <main className="flex-1 overflow-y-auto w-full h-full bg-cream relative custom-scrollbar">
              {children}
           </main>
        </div>

      </div>

      {/* Mobile Container (Only visible on small screens) */}
      <div className="flex md:hidden flex-col w-full h-full bg-cream relative">
         <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
           {children}
         </main>
         <div className="absolute bottom-0 w-full z-50">
           <Navigation />
         </div>
      </div>
    </>
  );
}
