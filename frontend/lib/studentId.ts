export function getStudentId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("student_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("student_id", id);
  }
  return id;
}