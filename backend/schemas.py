from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str

    class Config:
        from_attributes = True


class FeedbackOut(BaseModel):
    score: float
    green: list[str]
    yellow: list[str]


class SketchOut(BaseModel):
    id: int
    task_id: Optional[int]
    image_url: str
    score: float
    feedback_json: dict
    created_at: datetime

    class Config:
        from_attributes = True
