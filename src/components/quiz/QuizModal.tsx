"use client";

import { useState } from "react";
import type { Question } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Brain, ChevronRight, RotateCcw } from "lucide-react";

interface QuizModalProps {
  questions: Question[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardTitle: string;
}

export function QuizModal({ questions, open, onOpenChange, cardTitle }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.answer;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setShowResult(true);
    setAnswered(true);
    if (option === currentQuestion.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
      setAnswered(false);
    }
  };

  const handleClose = () => {
    const newOpen = false;
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
    onOpenChange(newOpen);
  };

  if (questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              刷题练习
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <p>该知识点暂无练习题。</p>
            <p className="text-xs mt-2">后续版本将支持自动从题库导入。</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const allDone = isLastQuestion && answered;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Brain className="h-5 w-5 text-purple-500" />
            刷题练习 · {cardTitle}
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              {currentIndex + 1}/{questions.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm font-medium leading-relaxed">
            {currentQuestion.question}
          </div>

          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              const isAnswer = option === currentQuestion.answer;

              let optionClass = "border hover:bg-muted/50";
              if (showResult) {
                if (isAnswer) {
                  optionClass = "border-green-500 bg-green-50 dark:bg-green-950";
                } else if (isSelected && !isCorrect) {
                  optionClass = "border-red-500 bg-red-50 dark:bg-red-950";
                } else {
                  optionClass = "opacity-50";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={answered}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    optionClass
                  )}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                    {option}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isAnswer && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={cn(
                "rounded-lg p-3 text-sm",
                isCorrect
                  ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              )}
            >
              <p className="font-semibold mb-1">
                {isCorrect ? "回答正确!" : "回答错误"}
              </p>
              {currentQuestion.explanation && (
                <p className="text-xs opacity-80">{currentQuestion.explanation}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              得分：{score}/{currentIndex + (answered ? 1 : 0)}
            </div>
            <div className="flex gap-2">
              {allDone ? (
                <Button size="sm" onClick={handleClose}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  完成练习
                </Button>
              ) : (
                answered && (
                  <Button size="sm" onClick={handleNext}>
                    {isLastQuestion ? "查看结果" : "下一题"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
