def chunk_text(
    pages: list[dict],
    chunk_size: int = 3000,
    overlap: int = 300,
) -> list[dict]:
    chunks = []

    for page in pages:
        text = page["text"]

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk = text[start:end]

            if chunk.strip():
                chunks.append({
                    "content": chunk.strip(),
                    "page": page["page"],
                })

            start = end - overlap

    return chunks