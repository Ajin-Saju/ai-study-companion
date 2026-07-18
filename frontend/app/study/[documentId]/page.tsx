"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { generateContent, streamContent } from "@/lib/api";
import FlashCard from "@/components/FlashCard";
import QuizPlayer from "@/components/QuizPlayer";
import MCQPlayer from "@/components/MCQPlayer";

const TABS = ["Explain", "Quiz", "Flashcards", "MCQs", "Assignment", "Summary"] as const;
type Tab = typeof TABS[number];

const TAB_COLORS: Record<Tab, string> = {
  Explain: "from-[#7C3AED] to-[#6D28D9]",
  Quiz: "from-[#FF6B4A] to-[#EC4899]",
  Flashcards: "from-[#EC4899] to-[#7C3AED]",
  MCQs: "from-[#06B6D4] to-[#7C3AED]",
  Assignment: "from-[#FFC145] to-[#FF6B4A]",
  Summary: "from-[#22C55E] to-[#06B6D4]",
};

export default function StudyPage() {
  const { documentId } = useParams();
  const docId = Number(documentId);
  const [tab, setTab] = useState<Tab>("Explain");
  const [streamedText, setStreamedText] = useState("");
  const [quiz, setQuiz] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any>(null);
  const [mcq, setMcq] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runTab(t: Tab) {
    setTab(t);
    setLoading(true);
    if (t === "Explain") {
      setStreamedText("");
      await streamContent("explain", docId, undefined, (tok) => setStreamedText((p) => p + tok));
    } else if (t === "Summary") {
      setStreamedText("");
      await streamContent("summary", docId, undefined, (tok) => setStreamedText((p) => p + tok));
    } else if (t === "Quiz") {
      setQuiz(await generateContent("quiz", docId));
    } else if (t === "Flashcards") {
      setFlashcards(await generateContent("flashcards", docId));
    } else if (t === "MCQs") {
      setMcq(await generateContent("mcq", docId));
    } else if (t === "Assignment") {
      setAssignment(await generateContent("assignment", docId));
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#FFFBF5] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => runTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                tab === t
                  ? `bg-gradient-to-r ${TAB_COLORS[t]} text-white shadow-md scale-105`
                  : "border border-[#EDE9F7] bg-white text-[#211F36] hover:border-[#7C3AED]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#7C3AED]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#EC4899] [animation-delay:0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B4A] [animation-delay:0.2s]" />
            <span className="ml-1 font-medium">Generating…</span>
          </div>
        )}

        {!loading && (tab === "Explain" || tab === "Summary") && (
          <div className="whitespace-pre-wrap rounded-3xl border border-[#EDE9F7] bg-white p-6 shadow-sm">
            {streamedText}
          </div>
        )}
        {!loading && tab === "Quiz" && quiz?.questions && (
          <QuizPlayer documentId={docId} questions={quiz.questions} />
        )}
        {!loading && tab === "Flashcards" && flashcards?.flashcards && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {flashcards.flashcards.map((f: any, i: number) => (
              <FlashCard key={i} term={f.term} definition={f.definition} />
            ))}
          </div>
        )}
        {!loading && tab === "MCQs" && mcq?.questions && (
          <MCQPlayer documentId={docId} questions={mcq.questions} />
        )}
        {!loading && tab === "Assignment" && assignment?.assignments && (
          <div className="space-y-4">
            {assignment.assignments.map((a: any, i: number) => (
              <div key={i} className="rounded-3xl border border-[#EDE9F7] bg-white p-4 shadow-sm">
                <h3 className="font-bold text-[#211F36]">{a.title}</h3>
                <p className="mt-1 text-sm text-[#6B647F]">{a.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
