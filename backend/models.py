import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON, Float
from database import Base

class Student(Base):
    __tablename__ = "students"
    student_id = Column(String, primary_key=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.student_id"))
    title = Column(String)
    source_type = Column(String)
    raw_text = Column(Text)
    chapters = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GeneratedItem(Base):
    __tablename__ = "generated_items"
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    type = Column(String)
    content = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    student_id = Column(String, ForeignKey("students.student_id"))
    score = Column(Float)
    total = Column(Integer)
    taken_at = Column(DateTime, default=datetime.datetime.utcnow)