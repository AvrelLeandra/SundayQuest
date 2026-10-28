import { supabase } from "@/lib/supabase";
import { FoodCardData, getStoredFoodCards, saveFoodCard as saveLocalFoodCard } from "@/lib/pixelate";

export interface SyncPayload {
  version: number;
  exportedAt: string;
  foodCards: FoodCardData[];
  customQuests: any[];
  deletedQuests: string[];
}

let isSyncing = false;
let realtimeChannel: any = null;

// Check if Supabase client has valid, active URL configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return (
    url.startsWith("https://") &&
    !url.includes("placeholder") &&
    !url.includes("wwwzwbnutshhhttumzyu") &&
    key.length > 20
  );
}

/**
 * Maps a local FoodCardData object to Supabase food_cards table format
 */
function cardToSupabase(card: FoodCardData) {
  return {
    id: card.id,
    name: card.name,
    place_name: card.placeName,
    neighborhood: card.neighborhood || "",
    category: card.category,
    points: card.points || 0,
    rating: card.rating || 5,
    color_theme: card.colorTheme || "coral",
    image_url: card.imageUrl || "",
    created_at: card.createdAt || new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Maps a Supabase food_cards row to local FoodCardData format
 */
function supabaseToCard(row: any): FoodCardData {
  return {
    id: row.id,
    name: row.name,
    placeName: row.place_name,
    neighborhood: row.neighborhood || undefined,
    category: row.category,
    points: row.points || 0,
    rating: row.rating || 5,
    colorTheme: row.color_theme || "coral",
    imageUrl: row.image_url || "/food_icons/restaurant.png",
    createdAt: row.created_at || new Date().toISOString().split("T")[0],
  };
}

/**
 * Push a single food card to Supabase cloud
 */
export async function pushCardToCloud(card: FoodCardData): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = cardToSupabase(card);
    const { error } = await supabase.from("food_cards").upsert(row);
    if (error) {
      console.warn("[CloudSync] Failed to push card to cloud:", error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn("[CloudSync] Network error pushing card:", e.message);
    return false;
  }
}

/**
 * Delete a food card from Supabase cloud
 */
export async function deleteCardFromCloud(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from("food_cards").delete().eq("id", id);
    if (error) {
      console.warn("[CloudSync] Failed to delete card from cloud:", error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn("[CloudSync] Network error deleting card:", e.message);
    return false;
  }
}

/**
 * Push a custom quest to Supabase cloud
 */
export async function pushQuestToCloud(quest: any): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = {
      id: quest.id,
      name: quest.name,
      city: quest.city || "Bangalore",
      neighborhood: quest.neighborhood || "",
      category: quest.category || "Restaurant",
      price_level: quest.price_level || 2,
      rating: quest.rating || 0,
      favorite: !!quest.favorite,
      would_return: quest.would_return,
      notes: quest.notes || "",
      lat: quest.lat || null,
      lng: quest.lng || null,
      visit_count: quest.visit_count || 1,
      tags: quest.tags || [],
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("custom_quests").upsert(row);
    if (error) {
      console.warn("[CloudSync] Failed to push quest to cloud:", error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn("[CloudSync] Network error pushing quest:", e.message);
    return false;
  }
}

/**
 * Delete a quest from Supabase cloud
 */
export async function deleteQuestFromCloud(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from("custom_quests").delete().eq("id", id);
    if (error) {
      console.warn("[CloudSync] Failed to delete quest from cloud:", error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn("[CloudSync] Network error deleting quest:", e.message);
    return false;
  }
}

/**
 * Full bidirectional sync between localStorage and Supabase cloud.
 * Uploads local items missing from cloud, and downloads cloud items missing from local.
 */
export async function syncAllWithCloud(): Promise<{ success: boolean; cardsCount: number; questsCount: number; message: string }> {
  if (typeof window === "undefined") {
    return { success: false, cardsCount: 0, questsCount: 0, message: "Browser only" };
  }
  if (!isSupabaseConfigured()) {
    const localCards = getStoredFoodCards();
    return {
      success: false,
      cardsCount: localCards.length,
      questsCount: 0,
      message: "Supabase not configured or credentials missing in Vercel settings.",
    };
  }
  if (isSyncing) {
    return { success: true, cardsCount: 0, questsCount: 0, message: "Sync already in progress" };
  }

  isSyncing = true;
  try {
    // 1. Sync Food Cards
    const localCards = getStoredFoodCards();
    const { data: cloudCards, error: cardFetchErr } = await supabase.from("food_cards").select("*");

    let finalCards = [...localCards];
    if (!cardFetchErr && Array.isArray(cloudCards)) {
      const cloudMapped = cloudCards.map(supabaseToCard);
      const localIdSet = new Set(localCards.map((c) => c.id));
      const cloudIdSet = new Set(cloudMapped.map((c) => c.id));

      // Push local cards that don't exist in cloud yet
      const missingInCloud = localCards.filter((c) => !cloudIdSet.has(c.id));
      for (const card of missingInCloud) {
        await pushCardToCloud(card);
      }

      // Merge cloud cards missing from local
      const missingInLocal = cloudMapped.filter((c) => !localIdSet.has(c.id));
      finalCards = [...missingInLocal, ...localCards];

      localStorage.setItem("sq_food_cards", JSON.stringify(finalCards));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("sq_cards_updated"));
    }

    // 2. Sync Custom Quests
    const localQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
    const { data: cloudQuests, error: questFetchErr } = await supabase.from("custom_quests").select("*");

    let finalQuests = [...localQuests];
    if (!questFetchErr && Array.isArray(cloudQuests)) {
      const localIdSet = new Set(localQuests.map((q: any) => q.id));
      const cloudIdSet = new Set(cloudQuests.map((q: any) => q.id));

      // Push local quests that don't exist in cloud yet
      const missingInCloud = localQuests.filter((q: any) => !cloudIdSet.has(q.id));
      for (const quest of missingInCloud) {
        await pushQuestToCloud(quest);
      }

      // Merge cloud quests missing from local
      const missingInLocal = cloudQuests.filter((q: any) => !localIdSet.has(q.id));
      finalQuests = [...missingInLocal, ...localQuests];

      localStorage.setItem("sq_custom_quests", JSON.stringify(finalQuests));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("sq_quests_updated"));
    }

    return {
      success: true,
      cardsCount: finalCards.length,
      questsCount: finalQuests.length,
      message: `Synced ${finalCards.length} cards and ${finalQuests.length} quests with cloud.`,
    };
  } catch (e: any) {
    console.warn("[CloudSync] Sync error:", e.message);
    return { success: false, cardsCount: 0, questsCount: 0, message: e.message };
  } finally {
    isSyncing = false;
  }
}

/**
 * Initializes Supabase Realtime subscription so devices update live
 */
export function initRealtimeSync(onUpdate?: () => void): () => void {
  if (typeof window === "undefined" || !isSupabaseConfigured()) {
    return () => {};
  }
  if (realtimeChannel) {
    return () => {};
  }

  try {
    realtimeChannel = supabase
      .channel("sq_realtime_sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_cards" }, async () => {
        await syncAllWithCloud();
        if (onUpdate) onUpdate();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "custom_quests" }, async () => {
        await syncAllWithCloud();
        if (onUpdate) onUpdate();
      })
      .subscribe();

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
      }
    };
  } catch (e) {
    return () => {};
  }
}

/**
 * Generates an instant snapshot payload of the user's current data
 */
export function generateSyncPayload(): SyncPayload {
  if (typeof window === "undefined") {
    return { version: 1, exportedAt: new Date().toISOString(), foodCards: [], customQuests: [], deletedQuests: [] };
  }
  const foodCards = getStoredFoodCards();
  const customQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
  const deletedQuests = JSON.parse(localStorage.getItem("sq_deleted_quests") || "[]");

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    foodCards,
    customQuests,
    deletedQuests,
  };
}

/**
 * Encodes payload into URL-safe Base64 string
 */
export function encodeSyncPayload(payload: SyncPayload): string {
  try {
    const jsonStr = JSON.stringify(payload);
    // Use encodeURIComponent to handle UTF-8 symbols cleanly before btoa
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return base64;
  } catch (e) {
    console.error("Failed to encode sync payload:", e);
    return "";
  }
}

/**
 * Decodes URL-safe Base64 string back into SyncPayload
 */
export function decodeSyncPayload(encodedStr: string): SyncPayload | null {
  try {
    const raw = atob(encodedStr);
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(raw, (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.foodCards)) {
      return parsed as SyncPayload;
    }
    return null;
  } catch (e) {
    console.error("Failed to decode sync payload:", e);
    return null;
  }
}

/**
 * Applies a sync payload into localStorage and notifies UI
 */
export function applySyncPayload(payload: SyncPayload): { cardsImported: number; questsImported: number } {
  if (typeof window === "undefined" || !payload) return { cardsImported: 0, questsImported: 0 };

  // 1. Merge Food Cards
  const existingCards = getStoredFoodCards();
  const existingCardIds = new Set(existingCards.map((c) => c.id));
  const newCards = (payload.foodCards || []).filter((c) => !existingCardIds.has(c.id));
  const mergedCards = [...newCards, ...existingCards];
  localStorage.setItem("sq_food_cards", JSON.stringify(mergedCards));

  // 2. Merge Custom Quests
  const existingQuests = JSON.parse(localStorage.getItem("sq_custom_quests") || "[]");
  const existingQuestIds = new Set(existingQuests.map((q: any) => q.id));
  const newQuests = (payload.customQuests || []).filter((q: any) => !existingQuestIds.has(q.id));
  const mergedQuests = [...newQuests, ...existingQuests];
  localStorage.setItem("sq_custom_quests", JSON.stringify(mergedQuests));

  // 3. Merge Deleted Quests
  const existingDeleted = new Set(JSON.parse(localStorage.getItem("sq_deleted_quests") || "[]"));
  (payload.deletedQuests || []).forEach((id) => existingDeleted.add(id));
  localStorage.setItem("sq_deleted_quests", JSON.stringify(Array.from(existingDeleted)));

  // 4. Trigger UI Updates
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("sq_cards_updated"));
  window.dispatchEvent(new Event("sq_quests_updated"));

  // 5. If Cloud is active, push imported cards & quests to cloud too!
  if (isSupabaseConfigured()) {
    setTimeout(() => {
      syncAllWithCloud();
    }, 500);
  }

  return {
    cardsImported: newCards.length,
    questsImported: newQuests.length,
  };
}

/**
 * Generates the full sync URL that can be scanned or opened on mobile
 */
export function generateSyncUrl(): string {
  if (typeof window === "undefined") return "";
  const payload = generateSyncPayload();
  const encoded = encodeSyncPayload(payload);
  const origin = window.location.origin;
  return `${origin}/sync#data=${encoded}`;
}
