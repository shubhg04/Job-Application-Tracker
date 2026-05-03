from fastapi import FastAPI
from sqlalchemy import text

from backend.app.database import SessionLocal

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