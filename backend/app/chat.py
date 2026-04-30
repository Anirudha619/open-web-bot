from llama_index.core import VectorStoreIndex
from llama_index.core.vector_stores import MetadataFilters, MetadataFilter
from llama_index.embeddings.gemini import GeminiEmbedding
from .qdrant import client, get_storage
from .config import settings
from .llm import create_prompt, call_llm


embed_model = GeminiEmbedding(
    model_name="models/gemini-embedding-001",
    api_key=settings.google_api_key
)


async def ask(question: str, company_id: str):
    storage = get_storage()

    index = VectorStoreIndex.from_vector_store(
        storage.vector_store,
        embed_model=embed_model
    )

    filters = MetadataFilters(
        filters=[MetadataFilter(key="company_id", value=company_id)]
    )

    retriever = index.as_retriever(
        filters=filters,
        similarity_top_k=6,
        vector_store_query_mode="hybrid",
        sparse_top_k=12,
    )

    nodes = retriever.retrieve(question)
    context = "\n".join(node.text for node in nodes)
    # print('chunk: ')
    # (print(context))
    # print('---------------------------- ')

    prompt = create_prompt(context, question)
    answer = await call_llm(prompt)
    # print("ans: ", answer)

    return answer


def debug_chunks(company_id: str):
    """Check how many chunks exist in DB for a given company_id"""
    from qdrant_client.models import Filter, FieldCondition, MatchValue

    results, _ = client.scroll(
        collection_name=settings.collection_name,
        scroll_filter=Filter(
            must=[FieldCondition(key="company_id", match=MatchValue(value=company_id))]
        ),
        with_payload=True,
        with_vectors=False,
        limit=100
    )

    print(f"Total chunks in DB for company_id={company_id}: {len(results)}")
    for i, point in enumerate(results, 1):
        payload = point.payload or {}
        # print(f"  Chunk {i} | id={point.id} | text={str(payload.get('_node_content', ''))[:100]}...")

    return results