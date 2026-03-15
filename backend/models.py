from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey, DateTime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)  # easy / medium / hard
    created_at = Column(DateTime, default=datetime.utcnow)


class Sketch(Base):
    __tablename__ = "sketches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    image_url = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    feedback_json = Column(JSON, nullable=False)  # {green: [], yellow: []}
    created_at = Column(DateTime, default=datetime.utcnow)
