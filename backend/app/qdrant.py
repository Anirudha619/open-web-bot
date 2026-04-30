from qdrant_client import QdrantClient, AsyncQdrantClient
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core import StorageContext
from .config import settings

client = QdrantClient(url=settings.qdrant_url)
aclient = AsyncQdrantClient(url=settings.qdrant_url)


def get_storage():
    vector_store = QdrantVectorStore(
        client=client,
        aclient=aclient,
        collection_name=settings.collection_name,
        enable_hybrid=True,
        fastembed_sparse_model="Qdrant/bm25",
        batch_size=20,
    )

    return StorageContext.from_defaults(vector_store=vector_store)