from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "applied"
    applied_date: datetime
    notes: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    company: str
    role: str
    status: str
    applied_date: datetime
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: str