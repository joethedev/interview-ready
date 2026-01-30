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
      return "text-sm text-white/80 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors";
    }

    if (selectedAnswer === index) {
      return isCorrectAnswer(index)
        ? "text-sm text-white bg-green-600/80 border-green-400"
        : "text-sm text-white bg-red-600/80 border-red-400";
    }

    if (isCorrectAnswer(index)) {
      return "text-sm text-white bg-green-600/40 border-green-400";
    }

    return "text-sm text-white/50 bg-white/5";
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsFlipped(false);
  };

  return (
    <div className="perspective w-full">
      <div
        className={clsx(
          "relative w-full min-h-[400px] rounded-xl transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* ================= FRONT ================= */}
        <div className="absolute inset-0 rounded-xl bg-black/50 p-6 backface-hidden border border-white/10 overflow-auto">
          {/* ACTIONS */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <ActionButton label="Save for 30 days">
              <button
                onClick={() => setIsSaved((v) => !v)}
                className="text-white/60 hover:text-purple-400"
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
                    "hover:text-purple-400",
                    isPublic ? "text-green-400" : "text-white/60"
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
                  className="text-white/60 hover:text-purple-400"
                >
                  <RotateCcw size={18} />
                </button>
              </ActionButton>
            )}

            {isAnswered && (
              <ActionButton label="Flip to see explanation">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="text-white/60 hover:text-purple-400"
                >
                  <RotateCcw size={18} />
                </button>
              </ActionButton>
            )}

            <ActionButton label="Report incorrect or irrelevant answer">
              <button className="text-white/40 hover:text-red-400">
                <Flag size={18} />
              </button>
            </ActionButton>
          </div>

          <div className="pr-32">
            <p className="text-xs uppercase text-purple-400 mb-2">
              Question
            </p>

            <h3 className="text-lg font-semibold text-white mb-6">
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
                    className="w-4 h-4 mt-0.5 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                  />
                  <span className="flex-1 break-words">{option}</span>
                </li>
              ))}
            </ul>

            {isAnswered && (
              <p className="mt-6 text-sm text-center">
                {isCorrectAnswer(selectedAnswer) ? (
                  <span className="text-green-400 font-semibold">✓ Correct!</span>
                ) : (
                  <span className="text-red-400 font-semibold">✗ Incorrect</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div className="absolute inset-0 rounded-xl bg-purple-600 p-6 rotate-y-180 backface-hidden overflow-auto">
          <div className="flex justify-end mb-4">
            <ActionButton label="Back to question">
              <button
                onClick={() => setIsFlipped(false)}
                className="text-white/70 hover:text-white"
              >
                <RotateCcw size={18} />
              </button>
            </ActionButton>
          </div>

          <p className="text-xs uppercase text-purple-200 mb-2">
            Explanation
          </p>

          <div className="text-white text-sm leading-relaxed break-words">
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
