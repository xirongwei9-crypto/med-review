"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CardIndex } from "@/types";
import { getAllCards, getCoursesWithCardCount } from "@/lib/cards";
import { getTodayCards, resetDailyCards, getStudyProgress } from "@/lib/schedule";
import { getDailyTarget, setDailyTarget } from "@/lib/storage";
import { Card as CardUI } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ImportanceBadge } from "@/components/cards/ImportanceBadge";
import { CardDetail } from "@/components/cards/CardDetail";
import { Calendar, RefreshCw, Settings, Sparkles, ArrowRight } from "lucide-react";

export default function DailyPage() {
  const [todayCards, setTodayCards] = useState<CardIndex[]>([]);
  const [dailyTarget, setDailyTargetState] = useState(5);
  const [progress, setProgress] = useState({ totalCards: 0, reviewedCards: 0, progress: 0 });
  const [selectedCard, setSelectedCard] = useState<CardIndex | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = getDailyTarget();
    setDailyTargetState(target);
    setTodayCards(getTodayCards());
    setProgress(getStudyProgress());
  }, []);

  const handleSetTarget = (value: number) => {
    const clamped = Math.max(1, Math.min(50, value));
    setDailyTargetState(clamped);
    setDailyTarget(clamped);
  };

  const handleRefresh = () => {
    resetDailyCards();
    setTodayCards(getTodayCards());
  };

  if (!mounted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            每日推送
          </h1>
          <p className="text-muted-foreground mt-1">
            今日 {todayCards.length} 张卡片待复习
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="sm" />}
            >
              <Settings className="h-4 w-4 mr-1" />
              设置
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>每日推送设置</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <Label>每日推送数量</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={dailyTarget}
                      onChange={(e) => handleSetTarget(parseInt(e.target.value) || 5)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">张/天</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  学习进度：已复习 {progress.reviewedCards}/{progress.totalCards} 张卡片
                  （{progress.progress}%）
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重置今日推送
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {todayCards.length === 0 ? (
        <CardUI className="p-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">今日任务已完成!</h2>
          <p className="text-muted-foreground mb-4">
            你已经复习了所有可用的卡片。
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              开始新一轮
            </Button>
            <Link
              href="/library"
              className={buttonVariants({ size: "sm" })}
            >
              浏览卡片库
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </CardUI>
      ) : (
        <div className="space-y-4">
          {todayCards.map((card, index) => (
            <CardUI
              key={card.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedCard(card)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{card.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ImportanceBadge level={card.importance} />
                    <span className="text-xs text-muted-foreground">
                      {card.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </CardUI>
          ))}
        </div>
      )}

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          open={!!selectedCard}
          onOpenChange={(open) => {
            if (!open) setSelectedCard(null);
          }}
          allCards={getAllCards()}
        />
      )}
    </div>
  );
}
