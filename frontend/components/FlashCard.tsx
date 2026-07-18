"use client";
import { useState } from "react";

export default function FlashCard({ term, definition }: { term: string; definition: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`flex h-40 cursor-pointer items-center justify-center rounded-3xl p-4 text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${
        flipped
          ? "bg-gradient-to-br from-[#FF6B4A] to-[#EC4899] text-white"
          : "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white"
      }`}
    >
      <p className="font-bold">{flipped ? definition : term}</p>
    </div>
  );
}
