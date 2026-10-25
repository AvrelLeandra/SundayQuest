"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, MapPin, User, Home, Sparkles } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/quests", label: "QUESTS", icon: MapPin },
    { href: "/cards", label: "CARDS", icon: Sparkles },
    { href: "/map", label: "MAP", icon: Map },
    { href: "/profile", label: "PLAYER", icon: User },
  ];

  return (
    <div className="w-full h-full bg-deep-green border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] flex md:flex-col justify-around md:justify-start items-center p-2 md:p-4 z-50 rounded-sm relative overflow-hidden">
      
      {/* Desktop Signage Header */}
      <div className="hidden md:flex w-full flex-col items-center mb-6 pb-3 border-b-4 border-ink">
        <div className="w-12 h-1.5 bg-ink mb-2"></div>
        <h1 className="text-xs md:text-sm lg:text-base text-white-city font-bold tracking-wider text-center leading-snug whitespace-nowrap">
          SUNDAY<br/>QUEST
        </h1>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full md:mb-2 px-1 py-1.5 md:px-3 md:py-3 rounded-sm transition-all border-2
              ${
                isActive 
                  ? "bg-white-city text-ink border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] md:translate-x-1" 
                  : "bg-transparent text-light-sky border-transparent hover:border-light-sky/30 hover:bg-black/10"
              }
            `}
          >
            <item.icon className={`w-4 h-4 md:w-5 md:h-5 shrink-0 mb-1 md:mb-0 md:mr-2.5 ${isActive ? 'text-ink' : 'text-light-sky'}`} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[0.55rem] md:text-[0.65rem] lg:text-xs font-bold tracking-wider whitespace-nowrap ${isActive ? '' : 'drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}




