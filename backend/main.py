from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import documents, generate, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Study Companion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}