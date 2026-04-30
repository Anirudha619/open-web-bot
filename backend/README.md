uv run uvicorn app.main:app --reload --port 4000

docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant