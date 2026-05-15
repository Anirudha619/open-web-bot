from supabase import create_client
from .config import settings

supabase = create_client(settings.supabase_url, settings.supabase_key)

BUCKET = settings.supabase_storage_bucket


def upload_logo(file_bytes: bytes, filename: str, chatbot_id: str) -> str | None:
    try:
        path = f"{chatbot_id}/{filename}"
        supabase.storage.from_(BUCKET).upload(path, file_bytes)
        return supabase.storage.from_(BUCKET).get_public_url(path)
    except Exception:
        return None
