import type { DailyCardsState, FavoriteState } from "@/types";

const FAVORITES_KEY = "med-review-favorites";
const DAILY_CARDS_KEY = "med-review-daily";
const DAILY_TARGET_KEY = "med-review-daily-target";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as FavoriteState;
    return data.favoriteIds;
  } catch {
    return [];
  }
}

export function addFavorite(cardId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(cardId)) {
    favorites.push(cardId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify({ favoriteIds: favorites }));
  }
}

export function removeFavorite(cardId: string): void {
  const favorites = getFavorites().filter((id) => id !== cardId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify({ favoriteIds: favorites }));
}

export function isFavorite(cardId: string): boolean {
  return getFavorites().includes(cardId);
}

export function toggleFavorite(cardId: string): boolean {
  if (isFavorite(cardId)) {
    removeFavorite(cardId);
    return false;
  } else {
    addFavorite(cardId);
    return true;
  }
}

export function getDailyTarget(): number {
  if (typeof window === "undefined") return 5;
  try {
    const raw = localStorage.getItem(DAILY_TARGET_KEY);
    return raw ? parseInt(raw, 10) : 5;
  } catch {
    return 5;
  }
}

export function setDailyTarget(count: number): void {
  localStorage.setItem(DAILY_TARGET_KEY, String(count));
}

export function getDailyCardsState(): DailyCardsState {
  if (typeof window === "undefined") {
    return { lastPushDate: "", pushedCardIds: [], dailyTarget: 5 };
  }
  try {
    const raw = localStorage.getItem(DAILY_CARDS_KEY);
    if (!raw) {
      return { lastPushDate: "", pushedCardIds: [], dailyTarget: getDailyTarget() };
    }
    return JSON.parse(raw) as DailyCardsState;
  } catch {
    return { lastPushDate: "", pushedCardIds: [], dailyTarget: getDailyTarget() };
  }
}

export function saveDailyCardsState(state: DailyCardsState): void {
  localStorage.setItem(DAILY_CARDS_KEY, JSON.stringify(state));
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}
