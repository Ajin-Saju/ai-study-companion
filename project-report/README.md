# AI Study Companion Project Report

## Overview

**AI Study Companion** is a learning assistant app with a FastAPI backend and a Next.js frontend. It helps students upload documents and generate explanations, summaries, quizzes, flashcards, multiple-choice questions, and study assignments.

## Project Structure

- `backend/`
  - FastAPI app serving the AI document processing API
  - `main.py` starts the FastAPI server
  - `routers/` contains API endpoints for document upload, generation, and dashboard data
  - `database.py` configures SQLAlchemy and SQLite
  - `requirements.txt` lists Python dependencies
- `frontend/`
  - Next.js app with React UI
  - `app/` contains the page routes and UI layout
  - `components/` contains reusable UI components
  - `lib/api.ts` contains frontend API calls to the backend
  - `public/` contains static assets used by the frontend
- `docker-compose.yml`
  - Orchestrates both backend and frontend containers for local development

## Key Features

- Document upload and text extraction
- AI-generated explanations, summaries, quizzes, flashcards, MCQs, and assignments
- Dashboard with study progress metrics and charts
- CORS-enabled backend API for frontend integration
- Docker Compose support for quick startup

## Running the App

### Option 1: Docker

```powershell
cd c:\Users\Lenovo\Desktop\IBM\ai-study-companion
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Option 2: Manual

#### Backend

```powershell
cd c:\Users\Lenovo\Desktop\IBM\ai-study-companion\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```powershell
cd c:\Users\Lenovo\Desktop\IBM\ai-study-companion\frontend
npm install
npm run dev
```

## Notes

- The backend reads API keys from `backend/.env`.
- The frontend uses `NEXT_PUBLIC_API_URL=http://localhost:8000` to call the backend.
- Backend health check: `http://localhost:8000/health`

## Architecture Diagram

![Project Architecture](architecture.png)
