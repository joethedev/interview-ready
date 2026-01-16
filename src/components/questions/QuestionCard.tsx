"use client";

import { useState } from "react";
import clsx from "clsx";

type QuestionCardProps = {
  question: string;
  answer: string;
};

export default function QuestionCard({ question, answer }: QuestionCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={clsx(
          "relative h-60 w-full rounded-xl transition-transform duration-700 preserve-3d",
          flipped && "rotate-y-180"
        )}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-xl bg-black/50 p-6 backface-hidden border border-white/10">
          <p className="text-xs uppercase text-purple-400 mb-2">
            Question
          </p>
          <h3 className="text-lg font-semibold text-white">
            {question}
          </h3>

          <p className="absolute bottom-4 right-4 text-xs text-white/40">
            Click to flip
          </p>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rounded-xl bg-purple-600 p-6 rotate-y-180 backface-hidden">
          <p className="text-xs uppercase text-purple-200 mb-2">
            Answer
          </p>
          <p className="text-white text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
