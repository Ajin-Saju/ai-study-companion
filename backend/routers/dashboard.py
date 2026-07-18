from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Document, QuizAttempt
from schemas import QuizAttemptRequest

router = APIRouter()

@router.post("/quiz-attempts")
def record_attempt(payload: QuizAttemptRequest, db: Session = Depends(get_db)):
    attempt = QuizAttempt(
        document_id=payload.document_id,
        student_id=payload.student_id,
        score=payload.score,
        total=payload.total,
    )
    db.add(attempt)
    db.commit()
    return {"status": "recorded"}

@router.get("/dashboard")
def dashboard(student_id: str, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.student_id == student_id).all()
    attempts = db.query(QuizAttempt).filter(QuizAttempt.student_id == student_id).all()
    avg_score = (
        sum(a.score / a.total for a in attempts) / len(attempts) * 100
        if attempts else 0
    )
    timeline = [
        {"date": a.taken_at.strftime("%Y-%m-%d"), "score": round(a.score / a.total * 100, 1)}
        for a in attempts
    ]
    return {
        "total_documents": len(docs),
        "total_quiz_attempts": len(attempts),
        "average_score": round(avg_score, 1),
        "timeline": timeline,
        "documents": [{"id": d.id, "title": d.title} for d in docs],
    }