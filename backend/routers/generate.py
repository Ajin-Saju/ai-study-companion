from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Document, GeneratedItem
from schemas import GenerateRequest
from ai_prompts import (
    EXPLAIN_PROMPT, SUMMARY_PROMPT, QUIZ_PROMPT,
    FLASHCARDS_PROMPT, MCQ_PROMPT, ASSIGNMENT_PROMPT,
    generate_json, stream_text,
)

router = APIRouter()

def get_document_text(db: Session, document_id: int, section: str | None) -> str:
    doc = db.query(Document).filter(Document.id == document_id).first()
    if section and doc.chapters and section in doc.chapters:
        return doc.chapters[section]
    return (doc.raw_text or "")[:6000]

def save_item(db, document_id, item_type, data):
    item = GeneratedItem(document_id=document_id, type=item_type, content=data)
    db.add(item)
    db.commit()
    return data

@router.post("/generate/explain")
def generate_explain(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    prompt = EXPLAIN_PROMPT.format(text=text)
    def event_stream():
        for token in stream_text(prompt):
            yield f"data: {token}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@router.post("/generate/summary")
def generate_summary(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    prompt = SUMMARY_PROMPT.format(text=text)
    def event_stream():
        for token in stream_text(prompt):
            yield f"data: {token}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@router.post("/generate/quiz")
def generate_quiz(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    data = generate_json(QUIZ_PROMPT.format(text=text))
    return save_item(db, payload.document_id, "quiz", data)

@router.post("/generate/flashcards")
def generate_flashcards(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    data = generate_json(FLASHCARDS_PROMPT.format(text=text))
    return save_item(db, payload.document_id, "flashcards", data)

@router.post("/generate/mcq")
def generate_mcq(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    data = generate_json(MCQ_PROMPT.format(text=text))
    return save_item(db, payload.document_id, "mcq", data)

@router.post("/generate/assignment")
def generate_assignment(payload: GenerateRequest, db: Session = Depends(get_db)):
    text = get_document_text(db, payload.document_id, payload.section)
    data = generate_json(ASSIGNMENT_PROMPT.format(text=text))
    return save_item(db, payload.document_id, "assignment", data)