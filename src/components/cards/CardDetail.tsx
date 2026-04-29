"use client";

import { useState, useEffect } from "react";
import type { CardIndex } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImportanceBadge } from "./ImportanceBadge";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { QuizModal } from "@/components/quiz/QuizModal";
import {
  Heart,
  Link2,
  MapPin,
  FileText,
  MessageCircle,
  Brain,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface CardDetailProps {
  card: CardIndex;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allCards: CardIndex[];
}

export function CardDetail({ card, open, onOpenChange, allCards }: CardDetailProps) {
  const [favorited, setFavorited] = useState(false);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(card.id));
  }, [card.id]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/card-content?file=${encodeURIComponent(card.mdxFile)}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || "");
        setLoading(false);
      })
      .catch(() => {
        setContent("");
        setLoading(false);
      });
  }, [card.mdxFile, open]);

  const handleFavorite = () => {
    const newState = toggleFavorite(card.id);
    setFavorited(newState);
  };

  const relatedCardsData = card.relatedCards
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is CardIndex => c !== undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold leading-tight">
                {card.title}
              </DialogTitle>
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
                onClick={handleFavorite}
                className={favorited ? "bg-rose-500 hover:bg-rose-600" : ""}
              >
                <Heart
                  className={cn("h-4 w-4", favorited && "fill-white")}
                />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : content ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">
                暂无详细内容，该卡片内容正在编写中。
              </p>
            )}

            <Separator />

            {/* Related Cards */}
            {relatedCardsData.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                  <Link2 className="h-4 w-4" />
                  关联知识点
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {relatedCardsData.map((rc) => (
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

            {/* PPT Reference */}
            {card.pptReference && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>
                  PPT：{card.pptReference.file} · 第 {card.pptReference.slide} 页
                </span>
              </div>
            )}

            {/* Mind Map Link */}
            <div>
              <Link
                href={`/mindmap/${card.course}`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <MapPin className="h-3.5 w-3.5" />
                在思维导图中查看
              </Link>
            </div>

            {/* Comment Section Placeholder */}
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>评论功能即将上线</span>
            </div>
          </div>
        </div>
      </DialogContent>

      {card.questions && card.questions.length > 0 && (
        <QuizModal
          questions={card.questions}
          open={quizOpen}
          onOpenChange={setQuizOpen}
          cardTitle={card.title}
        />
      )}
    </Dialog>
  );
}

