from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .ingest import ingest_documents
from .chat import ask
from .schemas import ChatRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/{company_id}")
async def upload(company_id: str, file: UploadFile = File(...)):
    content = await file.read()
    ingest_documents(content, file.filename, company_id)
    return {"status": "indexed"}


@app.post("/chat")
async def chat(req: ChatRequest):
    answer = await ask(req.message, req.company_id)
    return {"answer": answer}