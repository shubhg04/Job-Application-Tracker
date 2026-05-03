from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text 
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserResponse
from backend.app.security import hash_password

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Job Application Tracker API is running!"}


@app.get("/db-test")
def db_test():
    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connection successful"}
    finally:
        db.close()


@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user