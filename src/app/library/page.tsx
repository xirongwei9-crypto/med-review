"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllCards, getCoursesWithCardCount } from "@/lib/cards";
import type { CardIndex } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportanceBadge } from "@/components/cards/ImportanceBadge";
import { CardDetail } from "@/components/cards/CardDetail";
import { Search, BookOpen, Heart } from "lucide-react";

export default function LibraryPage() {
  const allCards = getAllCards();
  const coursesWithCount = getCoursesWithCardCount();
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardIndex | null>(null);
  const [activeCourse, setActiveCourse] = useState<string>("all");

  const filteredCards = allCards.filter((card) => {
    const matchesSearch =
      !search ||
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCourse = activeCourse === "all" || card.course === activeCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          卡片库
        </h1>
        <p className="text-muted-foreground mt-1">
          浏览所有知识点卡片，按课程和分类筛选
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索知识点或标签..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeCourse} onValueChange={setActiveCourse}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">全部课程 ({allCards.length})</TabsTrigger>
          {coursesWithCount.map((course) => (
            <TabsTrigger key={course.id} value={course.id}>
              {course.shortName} ({course.cardCount})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCourse}>
          {filteredCards.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              没有找到匹配的卡片
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight flex-1">
                      {card.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ImportanceBadge level={card.importance} />
                    <span className="text-xs text-muted-foreground">
                      {card.tags.slice(0, 2).join(" · ")}
                    </span>
                  </div>
                  {card.examFrequency > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      考频：{card.examFrequency} 次
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          open={!!selectedCard}
          onOpenChange={(open) => {
            if (!open) setSelectedCard(null);
          }}
          allCards={allCards}
        />
      )}
    </div>
  );
}
