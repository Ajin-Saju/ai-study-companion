import { getStudentId } from "./studentId";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("DEBUG API_URL is:", JSON.stringify(API_URL));

async function handleResponse(res: Response) {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      // response wasn't JSON, fall back to statusText
    }
    throw new Error(`Request failed (${res.status}): ${detail}`);
  }
  return res.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/documents`, {
    method: "POST",
    headers: { "X-Student-Id": getStudentId() },
    body: formData,
  });
  return handleResponse(res);
}

export async function listDocuments() {
  const res = await fetch(`${API_URL}/api/documents?student_id=${getStudentId()}`);
  return handleResponse(res);
}

export async function generateContent(
  kind: "quiz" | "flashcards" | "mcq" | "assignment",
  documentId: number,
  section?: string
) {
  const res = await fetch(`${API_URL}/api/generate/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, section }),
  });
  return handleResponse(res);
}

export async function streamContent(
  kind: "explain" | "summary",
  documentId: number,
  section: string | undefined,
  onToken: (t: string) => void
) {
  const res = await fetch(`${API_URL}/api/generate/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, section }),
  });

  if (!res.ok || !res.body) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      // not JSON
    }
    throw new Error(`Streaming request failed (${res.status}): ${detail}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split on the SSE record separator, keep the last (possibly incomplete) part in the buffer
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (part.startsWith("data: ")) {
        onToken(part.slice(6));
      }
    }
  }

  // Flush anything left over after the stream closes
  if (buffer.startsWith("data: ")) {
    onToken(buffer.slice(6));
  }
}

export async function recordQuizAttempt(documentId: number, score: number, total: number) {
  const res = await fetch(`${API_URL}/api/quiz-attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, student_id: getStudentId(), score, total }),
  });
  return handleResponse(res);
}

export async function getDashboard() {
  const res = await fetch(`${API_URL}/api/dashboard?student_id=${getStudentId()}`);
  return handleResponse(res);
}