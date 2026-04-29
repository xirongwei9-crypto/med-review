export interface CardIndex {
  id: string;
  title: string;
  course: string;
  category: string;
  importance: 1 | 2 | 3 | 4 | 5;
  examFrequency: number;
  tags: string[];
  relatedCards: string[];
  mdxFile: string;
  images: string[];
  pptReference: {
    file: string;
    slide: number;
  } | null;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CardFrontmatter {
  title: string;
  importance: number;
  examFrequency: number;
  tags: string[];
  relatedCards: string[];
}

export interface Question {
  id: string;
  type: "single" | "multiple" | "truefalse";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  group: string;
  value: number;
  x?: number;
  y?: number;
}

export interface MindMapEdge {
  from: string;
  to: string;
  label?: string;
  dashes?: boolean;
}

export interface MindMapGraph {
  courseId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Course {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  categories: Category[];
}

export interface DailyCardsState {
  lastPushDate: string;
  pushedCardIds: string[];
  dailyTarget: number;
}

export interface FavoriteState {
  favoriteIds: string[];
}
