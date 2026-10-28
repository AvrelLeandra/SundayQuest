"use client";

import React, { useState, useEffect } from "react";
import { X, Smartphone, Cloud, RefreshCw, Copy, Check, Download, Upload, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import {
  generateSyncUrl,
  generateSyncPayload,
  applySyncPayload,
  syncAllWithCloud,
  isSupabaseConfigured,
  SyncPayload,
} from "@/lib/sync";
import { getStoredFoodCards } from "@/lib/pixelate";

interface SyncDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynced?: () => void;
}

export default function SyncDevicesModal({ isOpen, onClose, onSynced }: SyncDevicesModalProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "cloud" | "backup">("qr");
  const [syncUrl, setSyncUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [cardCount, setCardCount] = useState<number>(0);
  const [questCount, setQuestCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const url = generateSyncUrl();
      setSyncUrl(url);
      setIsConfigured(isSupabaseConfigured());
      const cards = getStoredFoodCards();
      setCardCount(cards.length);
      try {
        const quests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
        setQuestCount(quests.length);
      } catch (e) {
        setQuestCount(0);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!syncUrl) return;
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    setCloudStatusMsg("Syncing with cloud...");
    const res = await syncAllWithCloud();
    setIsCloudSyncing(false);
    setCloudStatusMsg(res.message);
    const cards = getStoredFoodCards();
    setCardCount(cards.length);
    if (onSynced) onSynced();
  };

  const handleDownloadBackup = () => {
    const payload = generateSyncPayload();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sunday_quest_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.foodCards)) {
          const res = applySyncPayload(parsed as SyncPayload);
          alert(`Successfully imported ${res.cardsImported} food cards and ${res.questsImported} custom quests!`);
          const cards = getStoredFoodCards();
          setCardCount(cards.length);
          if (onSynced) onSynced();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  };

  const qrImageUrl = syncUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(syncUrl)}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-3 md:p-6 font-pixel overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-cream border-4 border-ink shadow-[8px_8px_0_rgba(38,52,58,1)] flex flex-col rounded-sm overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-ink text-white-city p-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-mustard" />
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase">
              SYNC TO PHONE & CLOUD
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white-city/80 hover:text-white-city hover:bg-white-city/10 p-1 border-2 border-transparent hover:border-white-city transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-sand border-b-2 border-ink px-4 py-2 flex items-center justify-between text-[0.6rem] font-bold text-ink">
          <span>
            CURRENT DATA: <span className="text-deep-green font-black">{cardCount} CARDS</span> /{" "}
            <span className="text-deep-green font-black">{questCount} CUSTOM QUESTS</span>
          </span>
          <span className="flex items-center gap-1">
            {isConfigured ? (
              <span className="text-deep-green flex items-center gap-1 font-black">
                <span className="w-2 h-2 rounded-full bg-deep-green inline-block animate-pulse" /> CLOUD ON
              </span>
            ) : (
              <span className="text-coral flex items-center gap-1 font-black">
                <span className="w-2 h-2 rounded-full bg-mustard inline-block" /> LOCAL ONLY
              </span>
            )}
          </span>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 border-b-2 border-ink bg-white-city text-[0.65rem] font-bold">
          <button
            onClick={() => setActiveTab("qr")}
            className={`py-2 text-center uppercase transition-colors flex items-center justify-center gap-1 ${
              activeTab === "qr"
                ? "bg-mustard text-ink border-b-4 border-ink"
                : "text-asphalt hover:bg-sand/50"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Phone Transfer
          </button>
          <button
            onClick={() => setActiveTab("cloud")}
            className={`py-2 text-center uppercase transition-colors flex items-center justify-center gap-1 ${
              activeTab === "cloud"
                ? "bg-mustard text-ink border-b-4 border-ink"
                : "text-asphalt hover:bg-sand/50"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" /> Cloud Sync
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`py-2 text-center uppercase transition-colors flex items-center justify-center gap-1 ${
              activeTab === "backup"
                ? "bg-mustard text-ink border-b-4 border-ink"
                : "text-asphalt hover:bg-sand/50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Backup / File
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* TAB 1: QR & Instant Phone Link */}
          {activeTab === "qr" && (
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-sand border-2 border-ink p-2 text-[0.65rem] text-ink font-bold leading-relaxed w-full">
                Scan this with your phone camera to instantly copy all your food cards and logged quests to your phone!
              </div>

              {qrImageUrl ? (
                <div className="p-3 bg-white border-4 border-ink shadow-[4px_4px_0_rgba(38,52,58,1)] flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImageUrl}
                    alt="Sync QR Code"
                    width={200}
                    height={200}
                    className="w-44 h-44 object-contain"
                  />
                  <span className="text-[0.55rem] font-bold text-asphalt mt-2 uppercase tracking-wider">
                    SCAN WITH PHONE CAMERA
                  </span>
                </div>
              ) : (
                <div className="p-6 text-[0.7rem] text-asphalt">Generating sync link...</div>
              )}

              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={handleCopy}
                  className="w-full bg-white-city hover:bg-sand border-2 border-ink py-2 text-[0.65rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-none"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-deep-green" /> LINK COPIED TO CLIPBOARD!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-asphalt" /> COPY PHONE SYNC LINK
                    </>
                  )}
                </button>
                <p className="text-[0.55rem] text-asphalt font-bold">
                  You can also copy and send this link to your phone via WhatsApp, Notes, or AirDrop.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Supabase Cloud Sync */}
          {activeTab === "cloud" && (
            <div className="flex flex-col gap-4 text-ink">
              <div className="bg-white-city border-2 border-ink p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold uppercase flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-asphalt" /> Supabase Database
                  </span>
                  {isConfigured ? (
                    <span className="bg-deep-green text-white-city px-2 py-0.5 text-[0.55rem] font-bold">
                      ACTIVE & CONNECTED
                    </span>
                  ) : (
                    <span className="bg-coral text-white-city px-2 py-0.5 text-[0.55rem] font-bold">
                      NOT CONFIGURED
                    </span>
                  )}
                </div>

                <p className="text-[0.6rem] text-asphalt leading-relaxed">
                  When Supabase is connected in your Vercel settings, all devices automatically sync every food card and quest in real-time in the background without needing QR codes!
                </p>
              </div>

              {isConfigured ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleManualCloudSync}
                    disabled={isCloudSyncing}
                    className="w-full bg-deep-green text-white-city border-2 border-ink py-2.5 text-[0.7rem] font-bold shadow-[3px_3px_0_rgba(38,52,58,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isCloudSyncing ? "animate-spin" : ""}`} />
                    {isCloudSyncing ? "SYNCING NOW..." : "SYNC WITH CLOUD NOW"}
                  </button>
                  {cloudStatusMsg && (
                    <p className="text-[0.6rem] text-center font-bold text-deep-green mt-1">
                      {cloudStatusMsg}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-sand/70 border-2 border-ink p-3 flex flex-col gap-2 text-[0.6rem] leading-relaxed">
                  <div className="font-bold text-ink flex items-center gap-1 text-[0.65rem]">
                    <AlertCircle className="w-4 h-4 text-coral" /> HOW TO ENABLE 24/7 AUTO CLOUD SYNC:
                  </div>
                  <ol className="list-decimal list-inside flex flex-col gap-1 text-asphalt">
                    <li>Create a free project at <span className="text-ink font-bold">supabase.com</span>.</li>
                    <li>Run the SQL script from <span className="text-ink font-bold">supabase_sync_schema.sql</span> in your Supabase SQL Editor.</li>
                    <li>Add <span className="text-ink font-bold">NEXT_PUBLIC_SUPABASE_URL</span> and <span className="text-ink font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> to your Vercel Project Environment Variables.</li>
                  </ol>
                  <p className="text-[0.55rem] text-deep-green font-bold mt-1">
                    ✓ In the meantime, use the "Phone Transfer" tab above to instantly copy all your food cards to your phone!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: File Backup / Restore */}
          {activeTab === "backup" && (
            <div className="flex flex-col gap-3">
              <div className="bg-sand border-2 border-ink p-2 text-[0.6rem] text-ink font-bold">
                Export a full JSON backup of your food cards and custom quests, or import from an existing backup file.
              </div>

              <button
                onClick={handleDownloadBackup}
                className="w-full bg-white-city hover:bg-sand border-2 border-ink py-2.5 text-[0.65rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-none"
              >
                <Download className="w-4 h-4 text-deep-green" /> DOWNLOAD BACKUP (JSON)
              </button>

              <label className="w-full bg-white-city hover:bg-sand border-2 border-ink py-2.5 text-[0.65rem] font-bold text-ink shadow-[2px_2px_0_rgba(38,52,58,1)] flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 active:shadow-none">
                <Upload className="w-4 h-4 text-mustard" /> IMPORT FROM BACKUP (JSON)
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-sand border-t-2 border-ink p-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-ink text-white-city border-2 border-ink px-4 py-1.5 text-[0.65rem] font-bold hover:bg-ink/90 active:translate-y-0.5"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
