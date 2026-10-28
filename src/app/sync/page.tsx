"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight, Smartphone, AlertTriangle, Layers, BookOpen } from "lucide-react";
import Link from "next/link";
import { decodeSyncPayload, applySyncPayload, SyncPayload } from "@/lib/sync";

export default function SyncPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [importedCards, setImportedCards] = useState<number>(0);
  const [importedQuests, setImportedQuests] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (!hash || !hash.includes("data=")) {
        setStatus("error");
        setErrorMessage("No sync data found in the URL. Please scan the QR code again from your computer.");
        return;
      }

      const rawData = hash.split("data=")[1];
      if (!rawData) {
        setStatus("error");
        setErrorMessage("Empty sync data. Please regenerate the QR code.");
        return;
      }

      const payload = decodeSyncPayload(rawData);
      if (!payload) {
        setStatus("error");
        setErrorMessage("Failed to decode sync data. The link might be truncated or corrupted.");
        return;
      }

      const res = applySyncPayload(payload);
      setImportedCards(payload.foodCards?.length || 0);
      setImportedQuests(payload.customQuests?.length || 0);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setErrorMessage(e.message || "An unexpected error occurred during sync.");
    }
  }, []);

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 font-pixel bg-cover bg-center"
      style={{
        backgroundImage: "url('/quests_bg.jpg')",
        backgroundSize: "100% 100%",
        imageRendering: "pixelated",
      }}
    >
      <div className="w-full max-w-md bg-cream border-4 border-ink shadow-[10px_10px_0_rgba(38,52,58,1)] p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Smartphone className="w-12 h-12 text-mustard animate-bounce" />
            <h1 className="text-lg font-black text-ink uppercase tracking-wider">
              SYNCING WITH YOUR PHONE...
            </h1>
            <p className="text-[0.65rem] text-asphalt font-bold">
              Importing your food cards and quests...
            </p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-deep-green border-4 border-ink flex items-center justify-center text-white-city shadow-[4px_4px_0_rgba(38,52,58,1)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-black text-ink uppercase tracking-wider flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-mustard" /> SYNC COMPLETE!
              </h1>
              <p className="text-[0.7rem] text-asphalt font-bold mt-1">
                All memories have been transferred to your phone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full my-2">
              <div className="bg-white-city border-2 border-ink p-3 shadow-[2px_2px_0_rgba(38,52,58,1)]">
                <span className="text-2xl font-black text-coral block">{importedCards}</span>
                <span className="text-[0.6rem] font-bold text-ink uppercase tracking-wider">
                  FOOD CARDS
                </span>
              </div>
              <div className="bg-white-city border-2 border-ink p-3 shadow-[2px_2px_0_rgba(38,52,58,1)]">
                <span className="text-2xl font-black text-deep-green block">{importedQuests}</span>
                <span className="text-[0.6rem] font-bold text-ink uppercase tracking-wider">
                  QUESTS
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-2">
              <Link
                href="/cards"
                className="w-full bg-mustard hover:brightness-105 border-2 border-ink py-3 text-[0.7rem] font-bold text-ink shadow-[3px_3px_0_rgba(38,52,58,1)] active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" /> VIEW MY FOOD CARDS
              </Link>
              <Link
                href="/quests"
                className="w-full bg-white-city hover:bg-sand border-2 border-ink py-2.5 text-[0.65rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-asphalt" /> GO TO LOGBOOK
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-coral border-4 border-ink flex items-center justify-center text-white-city shadow-[4px_4px_0_rgba(38,52,58,1)]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-lg font-black text-ink uppercase tracking-wider">
                SYNC FAILED
              </h1>
              <p className="text-[0.65rem] text-asphalt font-bold mt-1">
                {errorMessage}
              </p>
            </div>

            <Link
              href="/cards"
              className="w-full bg-ink text-white-city border-2 border-ink py-2.5 text-[0.65rem] font-bold shadow-[2px_2px_0_rgba(38,52,58,1)] active:translate-y-0.5 mt-2"
            >
              GO TO FOOD CARDS
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
