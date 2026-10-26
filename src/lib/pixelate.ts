export interface FoodCardData {
  id: string;
  name: string;
  placeName: string;
  neighborhood?: string;
  category: string;
  points: number;
  rating: number;
  power?: string;
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

export const CATEGORY_POINTS: Record<string, number> = {
  DESSERT: 750,
  MAIN: 850,
  PIZZA: 800,
  RAMEN: 800,
  BURGER: 750,
  CAFE: 600,
  BAKERY: 650,
  SNACK: 500,
  DRINK: 450,
  ITALIAN: 850,
  JAPANESE: 850,
  INDIAN: 850,
  STARTER: 650,
  "ICE CREAM": 600,
  ICE_CREAM: 600,
  MEXICAN: 800,
  RESTAURANT: 800,
  "BAR & GRILL": 750,
};

export function getPointsForCategory(cat: string): number {
  if (!cat) return 700;
  const rawUpper = cat.trim().toUpperCase();
  const underscore = rawUpper.replace(/[\s-]+/g, "_");
  const space = rawUpper.replace(/[_]+/g, " ");
  return CATEGORY_POINTS[rawUpper] || CATEGORY_POINTS[space] || CATEGORY_POINTS[underscore] || 700;
}

export const FOOD_CATEGORY_ICONS: Record<string, string> = {
  DESSERT: "/food_icons/dessert.png",
  MAIN: "/food_icons/main.png",
  PIZZA: "/food_icons/pizza.png",
  RAMEN: "/food_icons/ramen.png",
  BURGER: "/food_icons/burger.png",
  CAFE: "/food_icons/cafe.png",
  BAKERY: "/food_icons/bakery.png",
  SNACK: "/food_icons/snack.png",
  DRINK: "/food_icons/drink.png",
  ITALIAN: "/food_icons/italian.png",
  JAPANESE: "/food_icons/japanese.png",
  INDIAN: "/food_icons/indian.png",
  STARTER: "/food_icons/starter.png",
  "ICE CREAM": "/food_icons/ice_cream.png",
  ICE_CREAM: "/food_icons/ice_cream.png",
  MEXICAN: "/food_icons/mexican.png",
  RESTAURANT: "/food_icons/main.png",
  "BAR & GRILL": "/food_icons/burger.png",
};

export function getCategoryIcon(cat: string): string {
  if (!cat) return "/food_icons/snack.png";
  const rawUpper = cat.trim().toUpperCase();
  const underscore = rawUpper.replace(/[\s-]+/g, "_");
  const space = rawUpper.replace(/[_]+/g, " ");
  return FOOD_CATEGORY_ICONS[rawUpper] || FOOD_CATEGORY_ICONS[space] || FOOD_CATEGORY_ICONS[underscore] || "/food_icons/snack.png";
}

export const FOOD_CATEGORIES = [
  { value: "RAMEN", label: "RAMEN", points: 800 },
  { value: "BURGER", label: "BURGER", points: 750 },
  { value: "PIZZA", label: "PIZZA", points: 800 },
  { value: "DESSERT", label: "DESSERT", points: 750 },
  { value: "ICE CREAM", label: "ICE CREAM", points: 600 },
  { value: "CAFE", label: "CAFE", points: 600 },
  { value: "BAKERY", label: "BAKERY", points: 650 },
  { value: "STARTER", label: "STARTER", points: 650 },
  { value: "SNACK", label: "SNACK", points: 500 },
  { value: "DRINK", label: "DRINK", points: 450 },
  { value: "ITALIAN", label: "ITALIAN", points: 850 },
  { value: "JAPANESE", label: "JAPANESE", points: 850 },
  { value: "INDIAN", label: "INDIAN", points: 850 },
  { value: "MEXICAN", label: "MEXICAN", points: 800 },
  { value: "MAIN", label: "MAIN", points: 850 },
] as const;

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
export const DEFAULT_FOOD_CARDS: FoodCardData[] = [];

export function getStoredFoodCards(): FoodCardData[] {
  if (typeof window === "undefined") return DEFAULT_FOOD_CARDS;
  try {
    const raw = localStorage.getItem("sq_food_cards");
    if (!raw) {
      localStorage.setItem("sq_food_cards", JSON.stringify(DEFAULT_FOOD_CARDS));
      return DEFAULT_FOOD_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_FOOD_CARDS;
    return parsed.filter((c: FoodCardData) => !c.id.startsWith("card_default_"));
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
