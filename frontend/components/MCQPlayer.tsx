"use client";
import { useState } from "react";
import { recordQuizAttempt } from "@/lib/api";

type MCQ = { question: string; options: string[]; correct_index: number };

export default function MCQPlayer({ documentId, questions }: { documentId: number; questions: MCQ[] }) {
  const [selected, setSelected] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function submit() {
    let correct = 0;
    questions.forEach((q, i) => { if (selected[i] === q.correct_index) correct++; });
    setScore(correct);
    setSubmitted(true);
    recordQuizAttempt(documentId, correct, questions.length);
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-3xl border border-[#EDE9F7] bg-white p-4 shadow-sm">
          <p className="font-bold text-[#211F36]">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#06B6D4] text-xs text-white">
              {i + 1}
            </span>
            {q.question}
          </p>
          <div className="mt-3 space-y-2">
            {q.options.map((opt, oi) => {
              const isCorrect = submitted && oi === q.correct_index;
              const isWrongPick = submitted && selected[i] === oi && oi !== q.correct_index;
              return (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                    isCorrect
                      ? "border-[#22C55E] bg-[#22C55E]/10 font-semibold text-[#166534]"
                      : isWrongPick
                      ? "border-[#FF6B4A] bg-[#FF6B4A]/10 text-[#9A3412]"
                      : "border-[#EDE9F7] hover:border-[#06B6D4]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    disabled={submitted}
                    checked={selected[i] === oi}
                    onChange={() => {
                      const copy = [...selected];
                      copy[i] = oi;
                      setSelected(copy);
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={submit}
          className="rounded-full bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] px-6 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          Submit
        </button>
      ) : (
        <div className="rounded-2xl bg-[#FFC145]/20 px-4 py-3 font-bold text-[#211F36]">
          🎉 Score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
