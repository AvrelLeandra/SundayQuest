"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, MapPin, BookOpen, Receipt, User, Home, Gamepad2 } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/quests", label: "QUESTS", icon: MapPin },
    { href: "/map", label: "MAP", icon: Map },
    { href: "/receipt", label: "RECEIPT", icon: Receipt },
    { href: "/profile", label: "PLAYER", icon: User },
    
  ];

  return (
    <div className="w-full h-full bg-deep-green border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] flex md:flex-col justify-around md:justify-start items-center p-2 md:p-4 z-50 rounded-sm relative overflow-hidden">
      
      {/* Desktop Signage Header */}
      <div className="hidden md:flex w-full flex-col items-center mb-8 pb-4 border-b-4 border-ink">
        <div className="w-16 h-2 bg-ink mb-2"></div>
        <h1 className="text-xl text-white-city font-bold tracking-widest text-center">SUNDAY<br/>QUEST</h1>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full md:mb-2 px-1 py-2 md:px-3 md:py-4 rounded-sm transition-all border-2
              ${
                isActive 
                  ? "bg-white-city text-ink border-ink shadow-[2px_2px_0_rgba(38,52,58,1)] md:translate-x-1" 
                  : "bg-transparent text-light-sky border-transparent hover:border-light-sky/30"
              }
            `}
          >
            <item.icon className={`w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-0 md:mr-3 ${isActive ? 'text-ink' : 'text-light-sky'}`} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[0.55rem] md:text-xs font-bold tracking-widest ${isActive ? '' : 'drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}




