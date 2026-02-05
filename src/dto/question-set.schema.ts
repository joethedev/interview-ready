// src/dto/question-set.schema.ts
import { z } from "zod";

/**
 * Atomic question schema
 */
export const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswers: z.array(z.number()),
  explanation: z.string(),
});

/**
 * AI output schema
 */
export const QuestionsArraySchema = z.array(QuestionSchema);

/**
 * Request body when generating questions
 */
export const GenerateQuestionsSchema = z.object({
  jobDescription: z.string().min(30),
  saveQuestions: z.boolean().optional(),
});
