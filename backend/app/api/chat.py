from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.db.models import WorkspaceMember
from app.rag.pipeline import answer_question
from app.schemas.chat import ChatRequest

router = APIRouter(
    prefix="/workspaces/{workspace_id}",
    tags=["chat"],
)

@router.post("/chat")
def chat(
    workspace_id: str,
    request: ChatRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Verify that the current user belongs to this workspace
    membership = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this workspace",
        )

    answer = answer_question(
        question=request.question,
        workspace_id=workspace_id,
        db=db,
    )

    return {
        "answer": answer,
    }