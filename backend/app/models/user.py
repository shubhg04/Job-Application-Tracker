from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from backend.app.database import Base

"""
User(Base) → tells SQLAlchemy: “This class represents a table”

SQLAlchemy registers this model internally

Alembic reads this registered metadata

Alembic generates migration file (CREATE TABLE users)

You run: alembic upgrade head

THAT is when PostgreSQL table is actually created
"""

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)