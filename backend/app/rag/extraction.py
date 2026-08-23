from io import BytesIO
from pypdf import PdfReader


def extract_pdf_text(file_data: bytes) -> list[dict]:
    reader = PdfReader(BytesIO(file_data))

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            pages.append({
                "page": page_number,
                "text": text,
            })

    return pages