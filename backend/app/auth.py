from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client
from .config import settings

supabase = create_client(settings.supabase_url, settings.supabase_key)
security = HTTPBearer()


async def get_current_company(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        return str(user.user.id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
