from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.db.database import get_db
from app.api.documents import router as documents_router
from app.api.workspaces import router as workspaces_router
from app.api.chat import router as chat_router

app = FastAPI(title="AI Document Chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)
app.include_router(workspaces_router)
app.include_router(chat_router)

@app.get("/health")
def health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    
    return {
        "status": "ok",
        "database": result.scalar(),
    }

@app.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
    }

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AI Document Chat Backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)