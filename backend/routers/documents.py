import datetime
from fastapi import APIRouter, UploadFile, File, Header, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Document
from parsing import extract_text, chunk_by_heading

router = APIRouter()

def ensure_student(db: Session, student_id: str):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        student = Student(student_id=student_id, created_at=datetime.datetime.utcnow())
        db.add(student)
        db.commit()
    return student

@router.post("/documents")
async def upload_document(
    file: UploadFile = File(...),
    x_student_id: str = Header(...),
    db: Session = Depends(get_db),
):
    ensure_student(db, x_student_id)
    raw_bytes = await file.read()
    text = extract_text(file.filename, raw_bytes)
    chapters = chunk_by_heading(text)
    doc = Document(
        student_id=x_student_id,
        title=file.filename,
        source_type=file.filename.split(".")[-1],
        raw_text=text,
        chapters=chapters,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"document_id": doc.id, "title": doc.title, "chapters": list(chapters.keys())}

@router.get("/documents")
def list_documents(student_id: str, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.student_id == student_id).all()
    return [{"id": d.id, "title": d.title, "created_at": d.created_at} for d in docs]

@router.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    return {"id": doc.id, "title": doc.title, "chapters": list((doc.chapters or {}).keys())}