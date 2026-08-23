from sqlalchemy import text

from app.rag.embeddings import create_embedding


def search_documents(
    query: str,
    workspace_id,
    db,
    top_k: int = 5,
):
    query_embedding = create_embedding(query)

    result = db.execute(
        text("""
            SELECT
                dc.id,
                dc.document_id,
                dc.content,
                dc.metadata,
                1 - (dc.embedding <=> CAST(:embedding AS vector)) AS similarity
            FROM document_chunks dc
            JOIN documents d
                ON d.id = dc.document_id
            WHERE d.workspace_id = :workspace_id
            ORDER BY dc.embedding <=> CAST(:embedding AS vector)
            LIMIT :top_k
        """),
        {
            "embedding": str(query_embedding),
            "workspace_id": workspace_id,
            "top_k": top_k,
        },
    )

    return result.mappings().all()