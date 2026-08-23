from openai import OpenAI

from app.rag.retrieval import search_documents

client = OpenAI()


def answer_question(
    question: str,
    workspace_id,
    db,
):
    chunks = search_documents(
        query=question,
        workspace_id=workspace_id,
        db=db,
        top_k=5,
    )

    context = "\n\n".join(
        chunk["content"]
        for chunk in chunks
    )

    prompt = f"""
Use the following document context to answer the user's question.

If the answer cannot be found in the context, say that you
don't know based on the provided documents.

Context:

{context}

Question:

{question}
"""

    response = client.responses.create(
        model="gpt-5-mini",
        input=prompt,
    )

    return response.output_text