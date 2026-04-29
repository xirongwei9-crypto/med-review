import type { CardIndex } from "@/types";
import {
  getDailyCardsState,
  saveDailyCardsState,
  getDailyTarget,
  getTodayStr,
} from "./storage";
import { getAllCards } from "./cards";

export function getTodayCards(courseFilter?: string): CardIndex[] {
  const today = getTodayStr();
  const state = getDailyCardsState();
  const allCards = getAllCards();
  const dailyTarget = getDailyTarget();

  if (state.lastPushDate !== today) {
    const eligibleCards = allCards.filter((card) => {
      if (courseFilter && card.course !== courseFilter) return false;
      return !state.pushedCardIds.includes(card.id);
    });

    // Random shuffle
    const shuffled = [...eligibleCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, dailyTarget);

    const newState = {
      lastPushDate: today,
      pushedCardIds: [...state.pushedCardIds, ...selected.map((c) => c.id)],
      dailyTarget,
    };

    saveDailyCardsState(newState);
    return selected;
  }

  // Return cards that were pushed today
  const todayCards = state.pushedCardIds.slice(-dailyTarget);
  return todayCards
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is CardIndex => c !== undefined);
}

export function resetDailyCards(): void {
  const state = getDailyCardsState();
  state.lastPushDate = "";
  state.pushedCardIds = [];
  saveDailyCardsState(state);
}

export function getStudyProgress(): {
  totalCards: number;
  reviewedCards: number;
  progress: number;
} {
  const allCards = getAllCards();
  const state = getDailyCardsState();
  return {
    totalCards: allCards.length,
    reviewedCards: state.pushedCardIds.length,
    progress: allCards.length > 0 ? Math.round((state.pushedCardIds.length / allCards.length) * 100) : 0,
  };
}
