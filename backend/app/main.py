from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import get_db

app = FastAPI(title="AI Document Chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    
    return {
        "status": "ok",
        "database": result.scalar(),
    }

from app.db.models import Workspace


@app.get("/workspaces")
def get_workspaces(db: Session = Depends(get_db)):
    workspaces = db.query(Workspace).all()

    return workspaces

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AI Document Chat Backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)