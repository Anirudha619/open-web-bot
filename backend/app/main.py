from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .ingest import ingest_documents
from .chat import ask
from .schemas import ChatRequest, CreateChatbotRequest, ChatbotResponse
from .database import get_db, Chatbot, Company
from .storage import upload_logo
from .auth import get_current_company
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chatbots", response_model=ChatbotResponse)
async def create_chatbot(
    name: str = Form(...),
    system_prompt: str = Form(""),
    logo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    company_id: str = Depends(get_current_company),
):
    chatbot_id = str(uuid.uuid4())

    company = db.query(Company).get(company_id)
    if not company:
        company = Company(id=company_id)
        db.add(company)
        db.commit()

    logo_url = None
    if logo:
        logo_bytes = await logo.read()
        logo_url = upload_logo(logo_bytes, logo.filename, chatbot_id)

    chatbot = Chatbot(
        id=chatbot_id,
        company_id=company_id,
        name=name,
        system_prompt=system_prompt,
        logo_url=logo_url,
    )
    db.add(chatbot)
    db.commit()
    db.refresh(chatbot)

    return ChatbotResponse(
        id=str(chatbot.id),
        name=chatbot.name,
        system_prompt=chatbot.system_prompt,
        logo_url=chatbot.logo_url,
        doc_id=chatbot.doc_id,
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
