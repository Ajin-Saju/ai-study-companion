"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getDashboard } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFBF5]">
        <div className="flex items-center gap-2 text-[#7C3AED]">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#7C3AED]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#EC4899] [animation-delay:0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B4A] [animation-delay:0.2s]" />
          <span className="ml-1 font-medium">Loading dashboard…</span>
        </div>
      </main>
    );
  }

  if (data.total_documents === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF5] px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-3xl shadow-md">
          📊
        </div>
        <p className="text-lg font-bold text-[#211F36]">No activity yet</p>
        <p className="mt-1 text-[#6B647F]">Upload a document from the home page to start tracking progress.</p>
        <a
          href="/"
          className="mt-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-5 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          Go to Home
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFBF5] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold text-[#211F36]">Your Progress</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Documents" value={data.total_documents} color="text-[#7C3AED]" />
          <StatCard label="Quiz Attempts" value={data.total_quiz_attempts} color="text-[#FF6B4A]" />
          <StatCard label="Average Score" value={`${data.average_score}%`} color="text-[#22C55E]" />
          <StatCard label="Study Streak" value="—" color="text-[#EC4899]" />
        </div>

        <div className="mt-8 rounded-3xl border border-[#EDE9F7] bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-[#211F36]">Score over time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9F7" />
              <XAxis dataKey="date" stroke="#6B647F" fontSize={12} />
              <YAxis stroke="#6B647F" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#EDE9F7" }} />
              <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={3} dot={{ fill: "#EC4899", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 rounded-3xl border border-[#EDE9F7] bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-[#211F36]">Documents</h2>
          <ul className="divide-y divide-[#EDE9F7]">
            {data.documents.map((d: any) => (
              <li key={d.id} className="py-3">
                <a href={`/study/${d.id}`} className="font-medium text-[#7C3AED] hover:text-[#EC4899]">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
