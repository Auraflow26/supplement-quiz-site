import type { Metadata } from "next";
import { getQuizProgress } from "@/lib/data";
import { QuizFlow } from "./quiz-flow";

export const metadata: Metadata = { title: "Your quiz" };

export default async function QuizPage({ searchParams }: PageProps<"/quiz">) {
  const { retake } = await searchParams;
  const progress = await getQuizProgress();
  const answers = progress?.answers ?? {};
  // Retaking (or starting over after finishing) begins at question 1 with previous answers pre-selected.
  const step = retake || progress?.completed_at ? 0 : (progress?.step ?? 0);
  return <QuizFlow key={retake ? "retake" : "quiz"} initialAnswers={answers} initialStep={step} />;
}
