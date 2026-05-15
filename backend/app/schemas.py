from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    company_id: str


class CreateChatbotRequest(BaseModel):
    name: str
    system_prompt: Optional[str] = ""


class ChatbotResponse(BaseModel):
    id: str
    name: str
    system_prompt: str
    logo_url: Optional[str] = None
    doc_id: Optional[str] = None
