"use client";
import { useState } from "react";
import { recordQuizAttempt } from "@/lib/api";

type Q = { question: string; type: string; answer: string };

export default function QuizPlayer({ documentId, questions }: { documentId: number; questions: Q[] }) {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function submit() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    recordQuizAttempt(documentId, correct, questions.length);
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-3xl border border-[#EDE9F7] bg-white p-4 shadow-sm">
          <p className="font-bold text-[#211F36]">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#7C3AED] text-xs text-white">
              {i + 1}
            </span>
            {q.question}
          </p>
          <input
            className="mt-3 w-full rounded-xl border border-[#EDE9F7] bg-[#FFFBF5] p-2.5 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            value={answers[i]}
            onChange={(e) => {
              const copy = [...answers];
              copy[i] = e.target.value;
              setAnswers(copy);
            }}
            disabled={submitted}
          />
          {submitted && (
            <p className="mt-2 text-sm font-medium text-[#22C55E]">✓ Correct answer: {q.answer}</p>
          )}
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={submit}
          className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-6 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="rounded-2xl bg-[#FFC145]/20 px-4 py-3 font-bold text-[#211F36]">
          🎉 Score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
