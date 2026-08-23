from app.rag.chunking import chunk_text
from app.rag.embeddings import create_embedding
from app.rag.extraction import extract_pdf_text
from app.db.models import DocumentChunk

def index_document(
    file_data: bytes,
    document_id,
    db,
):
    pages = extract_pdf_text(file_data)

    chunks = chunk_text(pages)

    for index, chunk in enumerate(chunks):
        embedding = create_embedding(chunk["content"])

        document_chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=index,
            content=chunk["content"],
            embedding=embedding,
            metadata_={
                "page": chunk["page"],
            },
        )

        db.add(document_chunk)

    db.commit()

    return len(chunks)