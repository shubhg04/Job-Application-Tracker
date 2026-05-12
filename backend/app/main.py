from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from backend.app.routers import applications, users
from backend.app.database import SessionLocal

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://job-tracker-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(applications.router)


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