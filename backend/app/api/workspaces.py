from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.db.models import Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("")
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


@router.get("")
def get_workspaces(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    workspaces = (
        db.query(Workspace)
        .join(
            WorkspaceMember,
            Workspace.id == WorkspaceMember.workspace_id
        )
        .filter(
            WorkspaceMember.user_id == user.id
        )
        .all()
    )

    return workspaces