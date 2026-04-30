from qdrant_client import QdrantClient

def print_all_chunks():
    # Connect directly — adjust host/port/url to match your setup
    client = QdrantClient(host="localhost", port=6333)
    # or: QdrantClient(url="http://localhost:6333")
    # or: QdrantClient(path="./qdrant_data")  # if using local file storage

    collection_name = "company_docs"  # replace with your actual collection name

    all_points = []
    offset = None

    while True:
        results, next_offset = client.scroll(
            collection_name=collection_name,
            limit=100,
            offset=offset,
            with_payload=True,
            with_vectors=False,
        )
        all_points.extend(results)
        if next_offset is None:
            break
        offset = next_offset

    for i, point in enumerate(all_points, 1):
        payload = point.payload or {}
        print(f"Chunk {i} (id={point.id}):")
        print("Text:", payload.get("_node_content", payload.get("text", "N/A")))
        print("Metadata:", {k: v for k, v in payload.items() if k != "_node_content"})
        print("-" * 50)

    print(f"Total chunks stored: {len(all_points)}")

if __name__ == "__main__":
    print_all_chunks()