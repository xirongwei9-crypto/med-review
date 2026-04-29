"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CardIndex } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImportanceBadge } from "@/components/cards/ImportanceBadge";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { QuizModal } from "@/components/quiz/QuizModal";
import { Heart, ArrowLeft, Link2, MapPin, FileText, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  card: CardIndex;
  allCards: CardIndex[];
}

export function CardDetailPage({ card, allCards }: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(card.id));
  }, [card.id]);

  useEffect(() => {
    fetch(`/api/card-content?file=${encodeURIComponent(card.mdxFile)}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [card.mdxFile]);

  const relatedCards = card.relatedCards
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is CardIndex => c !== undefined);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{card.title}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <ImportanceBadge level={card.importance} />
            {card.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {card.questions && card.questions.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuizOpen(true)}
            >
              <Brain className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={favorited ? "default" : "outline"}
            size="icon"
            onClick={() => setFavorited(toggleFavorite(card.id))}
            className={cn(favorited && "bg-rose-500 hover:bg-rose-600")}
          >
            <Heart className={cn("h-4 w-4", favorited && "fill-white")} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">内容编写中...</p>
        )}

        <Separator />

        {relatedCards.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
              <Link2 className="h-4 w-4" /> 关联知识点
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {relatedCards.map((rc) => (
                <Link
                  key={rc.id}
                  href={`/cards/${rc.id}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  {rc.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {card.pptReference && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>PPT：{card.pptReference.file} · 第 {card.pptReference.slide} 页</span>
          </div>
        )}

        <Link
          href={`/mindmap/${card.course}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <MapPin className="h-3.5 w-3.5" />
          在思维导图中查看
        </Link>
      </div>

      {card.questions && card.questions.length > 0 && (
        <QuizModal
          questions={card.questions}
          open={quizOpen}
          onOpenChange={setQuizOpen}
          cardTitle={card.title}
        />
      )}
    </div>
  );
}
