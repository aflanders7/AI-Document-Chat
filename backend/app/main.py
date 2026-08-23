from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.db.models import Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate
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


@app.post("/workspaces")
def create_workspace(
    workspace_data: WorkspaceCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    workspace = Workspace(
        name=workspace_data.name,
    )

    db.add(workspace)
    db.flush()

    membership = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role="owner",
    )

    db.add(membership)
    db.commit()

    db.refresh(workspace)

    return workspace

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