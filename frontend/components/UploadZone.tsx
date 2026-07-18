"use client";
import { useState, useRef } from "react";
import { uploadDocument } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setLoading(true);
    const result = await uploadDocument(file);
    setLoading(false);
    router.push(`/study/${result.document_id}`);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
        dragging
          ? "border-[#7C3AED] bg-[#7C3AED]/5 scale-[1.01]"
          : "border-[#FFC145] bg-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.txt"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {loading ? (
        <p className="font-medium text-[#7C3AED]">Uploading and processing your document…</p>
      ) : (
        <>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-2xl text-white shadow-md">
            ⬆
          </div>
          <p className="text-lg font-bold text-[#211F36]">Drop a PDF, PPT, or notes file here</p>
          <p className="mt-1 text-sm text-[#6B647F]">or click to browse — no account needed</p>
        </>
      )}
    </div>
  );
}
