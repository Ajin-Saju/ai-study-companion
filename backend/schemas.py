from pydantic import BaseModel
from typing import Optional

class GenerateRequest(BaseModel):
    document_id: int
    section: Optional[str] = None

class QuizAttemptRequest(BaseModel):
    document_id: int
    student_id: str
    score: float
    total: int