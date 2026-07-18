import UploadZone from "@/components/UploadZone";

const features = [
  { title: "Explain Topics", desc: "Get any concept broken down simply.", color: "bg-[#7C3AED]" },
  { title: "Quizzes", desc: "Test yourself with auto-generated quizzes.", color: "bg-[#FF6B4A]" },
  { title: "Flashcards", desc: "Flip through term and definition cards.", color: "bg-[#EC4899]" },
  { title: "MCQs", desc: "Practice with multiple-choice questions.", color: "bg-[#06B6D4]" },
  { title: "Assignments", desc: "Get open-ended prompts to go deeper.", color: "bg-[#FFC145]" },
  { title: "Summaries", desc: "Condense chapters into key points.", color: "bg-[#22C55E]" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFBF5] px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#FFC145]/30 px-4 py-1 text-sm font-semibold text-[#7C3AED]">
          ✨ No sign-up needed
        </span>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#211F36]">
          Study smarter with{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#FF6B4A] bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="mt-3 text-lg text-[#6B647F]">
          Upload your material and get explanations, quizzes, flashcards, and more — instantly.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <UploadZone />
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-[#EDE9F7] bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`h-9 w-9 rounded-xl ${f.color} shadow-md`} />
            <h3 className="mt-3 font-bold text-[#211F36]">{f.title}</h3>
            <p className="mt-1 text-sm text-[#6B647F]">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          View your progress dashboard →
        </a>
      </div>
    </main>
  );
}
