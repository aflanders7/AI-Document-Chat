from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.supabase import supabase
from app.db.database import get_db
from app.db.models import Document, WorkspaceMember

from app.rag.indexing import index_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(
    workspace_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Check that the user belongs to the workspace
    membership = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user.id,
        )
        .first()
    )

    if not membership:
        return {"error": "You do not have access to this workspace"}

    # Read the file
    file_data = await file.read()

    # Storage path
    storage_path = f"{workspace_id}/{file.filename}"

    # Upload to Supabase Storage
    supabase.storage.from_("documents").upload(
        storage_path,
        file_data,
        {
            "content-type": file.content_type or "application/octet-stream"
        },
    )

    # Save document metadata
    document = Document(
        workspace_id=workspace_id,
        filename=file.filename,
        storage_path=storage_path,
        mime_type=file.content_type,
        file_size=len(file_data),
        status="uploaded",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    chunk_count = index_document(
        file_data=file_data,
        document_id=document.id,
        db=db,
    )

    document.status = "indexed"

    return {
        "id": str(document.id),
        "filename": document.filename,
        "status": document.status,
    }