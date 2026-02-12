"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  RotateCcw,
  Flag,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type QuestionCardProps = {
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

export default function QuestionCard({
  question,
  options,
  correctAnswers,
  explanation,
}: QuestionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      // Auto-flip to show explanation after a short delay
      setTimeout(() => setIsFlipped(true), 1000);
    }
  };

  const isCorrectAnswer = (index: number) => correctAnswers.includes(index);
  const isAnswered = selectedAnswer !== null;

  const getOptionClassName = (index: number) => {
    if (!isAnswered) {
      return "text-sm text-foreground bg-secondary/50 hover:bg-secondary border-border cursor-pointer transition-colors";
    }

    if (selectedAnswer === index) {
      return isCorrectAnswer(index)
        ? "text-sm text-white bg-green-600 border-green-500"
        : "text-sm text-white bg-destructive border-destructive";
    }

    if (isCorrectAnswer(index)) {
      return "text-sm text-foreground bg-green-100 border-green-500 dark:bg-green-950 dark:text-green-100";
    }

    return "text-sm text-muted-foreground bg-secondary/30 border-border";
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsFlipped(false);
  };

  return (
    <div className="perspective w-full">
      <div
        className={clsx(
          "relative w-full min-h-100 rounded-xl transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* ================= FRONT ================= */}
        <div className="absolute inset-0 rounded-xl bg-card p-6 backface-hidden border border-border overflow-auto shadow-card">
          {/* ACTIONS */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <ActionButton label="Save for 30 days">
              <button
                onClick={() => setIsSaved((v) => !v)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck size={18} />
                ) : (
                  <Bookmark size={18} />
                )}
              </button>
            </ActionButton>

            {isSaved && (
              <ActionButton label="Make public">
                <button
                  onClick={() => setIsPublic((v) => !v)}
                  className={clsx(
                    "hover:text-primary transition-colors",
                    isPublic ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  )}
                >
                  <Globe size={18} />
                </button>
              </ActionButton>
            )}

            {isAnswered && (
              <ActionButton label="Reset and try again">
                <button
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </ActionButton>
            )}

            {isAnswered && (
              <ActionButton label="Flip to see explanation">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </ActionButton>
            )}

            <ActionButton label="Report incorrect or irrelevant answer">
              <button className="text-muted-foreground/60 hover:text-destructive transition-colors">
                <Flag size={18} />
              </button>
            </ActionButton>
          </div>

          <div className="pr-32">
            <p className="text-xs uppercase text-primary mb-2 font-medium">
              Question
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-6">
              {question}
            </h3>

            {/* OPTIONS */}
            <ul className="space-y-3">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={clsx(
                    "rounded-md px-3 py-3 border flex items-start gap-3",
                    getOptionClassName(index)
                  )}
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className="w-4 h-4 mt-0.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />
                  <span className="flex-1 wrap-break-word">{option}</span>
                </li>
              ))}
            </ul>

            {isAnswered && (
              <p className="mt-6 text-sm text-center">
                {isCorrectAnswer(selectedAnswer) ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓ Correct!</span>
                ) : (
                  <span className="text-destructive font-semibold">✗ Incorrect</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div className="absolute inset-0 rounded-xl bg-primary p-6 rotate-y-180 backface-hidden overflow-auto shadow-card">
          <div className="flex justify-end mb-4">
            <ActionButton label="Back to question">
              <button
                onClick={() => setIsFlipped(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </ActionButton>
          </div>

          <p className="text-xs uppercase text-primary-foreground/90 mb-2 font-medium">
            Explanation
          </p>

          <div className="text-primary-foreground text-sm leading-relaxed wrap-break-word">
            {explanation}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL HELPER ================= */

function ActionButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
