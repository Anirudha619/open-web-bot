from llama_index.core import VectorStoreIndex
from llama_index.core.readers import StringIterableReader
from llama_index.embeddings.gemini import GeminiEmbedding
from .qdrant import get_storage
from .config import settings
from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=400,
    chunk_overlap=80
)

embed_model = GeminiEmbedding(
    model_name="models/gemini-embedding-001",
    api_key=settings.google_api_key
)


def ingest_documents(file_content: bytes, filename: str, company_id: str):
    ext = filename.split(".")[-1].lower()
    mime_types = {
        "txt": "text/plain",
        "md": "text/markdown",
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    mime = mime_types.get(ext, "text/plain")

    reader = StringIterableReader()
    documents = reader.load_data(texts=[file_content.decode("utf-8", errors="ignore")])

    for doc in documents:
        doc.metadata = {"company_id": company_id}

    storage = get_storage()
    nodes = splitter.get_nodes_from_documents(documents)

    VectorStoreIndex(
        nodes,
        storage_context=storage,
        embed_model=embed_model
    )