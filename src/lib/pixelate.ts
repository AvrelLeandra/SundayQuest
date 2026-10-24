export interface FoodCardData {
  id: string;
  name: string;
  placeName: string;
  neighborhood?: string;
  category: string;
  points: number;
  rating: number;
  power: string;
  footerText?: string;
  colorTheme: string;
  imageUrl: string;
  createdAt: string;
}

export const CARD_THEMES: Record<string, {
  name: string;
  bg: string;
  border: string;
  headerText: string;
  pillBg: string;
  pillText: string;
  starColor: string;
  starEmptyColor: string;
  contentBg: string;
  contentBorder: string;
  textColor: string;
  footerColor: string;
}> = {
  coral: {
    name: "Coral Strawberry",
    bg: "#FF9B9B",
    border: "#F37B7B",
    headerText: "#E05A5A",
    pillBg: "#EA6C6C",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#FFF9F5",
    contentBorder: "#FFE2DC",
    textColor: "#8A3D3D",
    footerColor: "#DE6464"
  },
  matcha: {
    name: "Matcha Mint",
    bg: "#A8DADC",
    border: "#85C2C5",
    headerText: "#357A7D",
    pillBg: "#457B9D",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#F4FBFA",
    contentBorder: "#D8EBE7",
    textColor: "#2B5357",
    footerColor: "#3D7A80"
  },
  banana: {
    name: "Butter Vanilla",
    bg: "#FFE382",
    border: "#ECC754",
    headerText: "#B38716",
    pillBg: "#D49C1E",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#FFFDF0",
    contentBorder: "#FAEDAF",
    textColor: "#785B10",
    footerColor: "#9E7B1E"
  },
  taro: {
    name: "Lavender Taro",
    bg: "#D7B9D5",
    border: "#BE97BD",
    headerText: "#875385",
    pillBg: "#995D97",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#FAF4FA",
    contentBorder: "#EBD4EB",
    textColor: "#663664",
    footerColor: "#824C80"
  },
  peach: {
    name: "Warm Peach",
    bg: "#FFBA92",
    border: "#F39E6D",
    headerText: "#CF6429",
    pillBg: "#E36C2F",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#FFF9F4",
    contentBorder: "#FFE0CC",
    textColor: "#8A3D14",
    footerColor: "#BA551E"
  },
  sage: {
    name: "Sage Pistachio",
    bg: "#B5D6A7",
    border: "#9BC28B",
    headerText: "#4F823C",
    pillBg: "#5E9B48",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#F6FAF4",
    contentBorder: "#DCEBD6",
    textColor: "#385C2A",
    footerColor: "#4B7C37"
  },
  sky: {
    name: "Sky Cotton",
    bg: "#A2D2FF",
    border: "#7CBAF7",
    headerText: "#2C75BF",
    pillBg: "#3A86D4",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#F4FAFF",
    contentBorder: "#D2E8FF",
    textColor: "#1F5287",
    footerColor: "#2F72B5"
  },
  caramel: {
    name: "Caramel Latte",
    bg: "#E3C2B0",
    border: "#CCA18B",
    headerText: "#8B583E",
    pillBg: "#9C6549",
    pillText: "#FFFFFF",
    starColor: "#FFFFFF",
    starEmptyColor: "rgba(255, 255, 255, 0.4)",
    contentBg: "#FAF5F2",
    contentBorder: "#EADBCE",
    textColor: "#6B3E29",
    footerColor: "#8A543A"
  }
};

export const FUN_POWERS = [
  "grants +100 cozy energy and permanently cures all Monday blues.",
  "so deliciously rich it stops time for a few magical bites.",
  "infinite comfort in a single plate. Warning: may cause sudden happy naps.",
  "boosts mood by +750 and leaves a lingering sense of pure satisfaction.",
  "crispy on the outside, cloud-soft on the inside, cooked to perfection.",
  "the ultimate comfort companion for lazy Sunday afternoon quests."
];

/**
 * Converts any image DataURL into genuine pixel art using HTML5 canvas
 * with nearest-neighbor scaling.
 */
export function pixelateImage(imageSrc: string, resolution: number = 48): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(imageSrc);
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const aspect = img.height / img.width;
        // Target small dimension for pixelation
        const smallWidth = Math.max(16, Math.min(100, resolution));
        const smallHeight = Math.max(16, Math.round(smallWidth * aspect));

        // 1. Draw small (downscale)
        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = smallWidth;
        smallCanvas.height = smallHeight;
        const smallCtx = smallCanvas.getContext("2d");
        if (!smallCtx) return resolve(imageSrc);

        smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);

        // 2. Upscale back with image smoothing turned completely OFF
        const displayWidth = 480;
        const displayHeight = Math.round(displayWidth * aspect);

        const displayCanvas = document.createElement("canvas");
        displayCanvas.width = displayWidth;
        displayCanvas.height = displayHeight;
        const displayCtx = displayCanvas.getContext("2d");
        if (!displayCtx) return resolve(imageSrc);

        displayCtx.imageSmoothingEnabled = false;
        // @ts-ignore
        displayCtx.mozImageSmoothingEnabled = false;
        // @ts-ignore
        displayCtx.webkitImageSmoothingEnabled = false;
        // @ts-ignore
        displayCtx.msImageSmoothingEnabled = false;

        displayCtx.drawImage(
          smallCanvas,
          0,
          0,
          smallWidth,
          smallHeight,
          0,
          0,
          displayWidth,
          displayHeight
        );

        resolve(displayCanvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Pixelation error:", err);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

/**
 * Default starter cards to make the collection lively on first load
 */
export const DEFAULT_FOOD_CARDS: FoodCardData[] = [
  {
    id: "card_default_1",
    name: "DEATH BY CHOCOLATE",
    placeName: "Corner House",
    neighborhood: "Residency Road",
    category: "DESSERT",
    points: 750,
    rating: 5,
    power: "power: dark chocolate cake drenched in thick hot fudge and roasted nuts. Gives +100 joy!",
    footerText: "works best on the weekends",
    colorTheme: "coral",
    imageUrl: "/food_ticket.jpg",
    createdAt: "2026-09-20"
  },
  {
    id: "card_default_2",
    name: "TRUFFLE SOURDOUGH PIZZA",
    placeName: "Brik Oven",
    neighborhood: "Indiranagar",
    category: "MAIN",
    points: 820,
    rating: 5,
    power: "power: leopard-spotted wood-fired crust with molten fresh mozzarella and wild mushrooms.",
    footerText: "best shared with player two",
    colorTheme: "sage",
    imageUrl: "/ramen_bg.jpg",
    createdAt: "2026-09-27"
  }
];

export function getStoredFoodCards(): FoodCardData[] {
  if (typeof window === "undefined") return DEFAULT_FOOD_CARDS;
  try {
    const raw = localStorage.getItem("sq_food_cards");
    if (!raw) {
      localStorage.setItem("sq_food_cards", JSON.stringify(DEFAULT_FOOD_CARDS));
      return DEFAULT_FOOD_CARDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FOOD_CARDS;
  } catch (e) {
    return DEFAULT_FOOD_CARDS;
  }
}

export function saveFoodCard(newCard: FoodCardData): FoodCardData[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getStoredFoodCards();
    const updated = [newCard, ...existing.filter((c) => c.id !== newCard.id)];
    localStorage.setItem("sq_food_cards", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save food card:", e);
    return [];
  }
}

export function deleteFoodCard(cardId: string): FoodCardData[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getStoredFoodCards();
    const updated = existing.filter((c) => c.id !== cardId);
    localStorage.setItem("sq_food_cards", JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}
