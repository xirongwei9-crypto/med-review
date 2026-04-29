import type { CardIndex, Course, MindMapGraph } from "@/types";

import coursesData from "../../data/courses.json";
import cardsIndexData from "../../data/cards-index.json";

export function getCourses(): Course[] {
  return coursesData as Course[];
}

export function getCourse(courseId: string): Course | undefined {
  return (coursesData as Course[]).find((c) => c.id === courseId);
}

export function getAllCards(): CardIndex[] {
  return cardsIndexData as CardIndex[];
}

export function getCardsByCourse(courseId: string): CardIndex[] {
  return (cardsIndexData as CardIndex[]).filter((c) => c.course === courseId);
}

export function getCardsByCategory(courseId: string, category: string): CardIndex[] {
  return (cardsIndexData as CardIndex[]).filter(
    (c) => c.course === courseId && c.category.startsWith(category)
  );
}

export function getCardById(id: string): CardIndex | undefined {
  return (cardsIndexData as CardIndex[]).find((c) => c.id === id);
}

export function getCoursesWithCardCount(): (Course & { cardCount: number })[] {
  const cards = cardsIndexData as CardIndex[];
  return (coursesData as Course[]).map((course) => ({
    ...course,
    cardCount: cards.filter((c) => c.course === course.id).length,
  }));
}

export function getCategoriesWithCardCount(courseId: string): { name: string; count: number }[] {
  const cards = getCardsByCourse(courseId);
  const categoryMap = new Map<string, number>();

  for (const card of cards) {
    const topCategory = card.category.split("/")[0];
    categoryMap.set(topCategory, (categoryMap.get(topCategory) || 0) + 1);
  }

  return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
}

export function getCardCategories(card: CardIndex): string[] {
  return card.category.split("/").filter(Boolean);
}
