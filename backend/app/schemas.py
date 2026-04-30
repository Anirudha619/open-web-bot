from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    company_id: str