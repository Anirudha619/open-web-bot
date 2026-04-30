from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    qdrant_url: str = "http://localhost:6333"
    collection_name: str = "company_docs"
    
    google_api_key: str
    cerebras_api_key: str
    groq_api_key: str
    llm_provider: str = "groq"

    class Config:
        env_file = ".env"


settings = Settings()