import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const isConfigured =
    url.startsWith("https://") &&
    !url.includes("placeholder") &&
    !url.includes("wwwzwbnutshhhttumzyu") &&
    key.length > 20;

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      message: "Supabase environment variables not configured on server.",
    });
  }

  try {
    const supabase = createClient(url, key);
    const { data: cards, error: cErr } = await supabase.from("food_cards").select("*");
    const { data: quests, error: qErr } = await supabase.from("custom_quests").select("*");

    if (cErr || qErr) {
      return NextResponse.json({
        configured: true,
        healthy: false,
        error: cErr?.message || qErr?.message,
      });
    }

    return NextResponse.json({
      configured: true,
      healthy: true,
      foodCardsCount: cards?.length || 0,
      customQuestsCount: quests?.length || 0,
    });
  } catch (e: any) {
    return NextResponse.json({
      configured: true,
      healthy: false,
      error: e.message,
    });
  }
}
