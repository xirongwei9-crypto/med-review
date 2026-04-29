"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCoursesWithCardCount, getAllCards } from "@/lib/cards";
import { getTodayCards, getStudyProgress } from "@/lib/schedule";
import { getDailyTarget, getTodayStr, getDailyCardsState } from "@/lib/storage";
import type { Course, CardIndex } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  GitGraph,
  Heart,
  Library,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [courses, setCourses] = useState<(Course & { cardCount: number })[]>([]);
  const [todayCards, setTodayCards] = useState<CardIndex[]>([]);
  const [dailyTarget, setDailyTarget] = useState(5);
  const [progress, setProgress] = useState({ totalCards: 0, reviewedCards: 0, progress: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCourses(getCoursesWithCardCount());
    setDailyTarget(getDailyTarget());
    setTodayCards(getTodayCards());
    setProgress(getStudyProgress());
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          医学复习助手
          <span className="text-rose-500"> MedReview</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          知识点卡片 + 思维导图，系统化复习医学课程。
          每日推送帮你保持学习节奏。
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              今日待复习
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayCards.length}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {dailyTarget} 张
              </span>
            </div>
            <Link
              href="/daily"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mt-2 p-0 h-auto gap-1"
              )}
            >
              去刷卡片 <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              学习进度
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.progress}%</div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress.reviewedCards}/{progress.totalCards} 张已推送
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              课程数
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">门课程</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              知识点总数
            </CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.totalCards}</div>
            <p className="text-xs text-muted-foreground mt-1">张卡片</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      <h2 className="text-xl font-bold mb-4">课程</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {courses.map((course) => (
          <Link key={course.id} href={`/library`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">{course.cardCount} 张卡片</Badge>
                  <span className="text-xs text-muted-foreground">
                    共 {course.categories.length} 个分类
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">快速入口</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/daily">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">每日推送</h3>
                <p className="text-xs text-muted-foreground">今日复习任务</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/library">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Library className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">卡片库</h3>
                <p className="text-xs text-muted-foreground">按课程浏览知识点</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mindmap">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <GitGraph className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">思维导图</h3>
                <p className="text-xs text-muted-foreground">知识点关联图谱</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
