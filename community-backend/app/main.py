from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from .database import create_tables, get_db, User, Internship, Hackathon, Mentor, Booking, ChatMessage
from .auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from .schemas import (
    UserCreate, UserResponse, Token, LoginRequest,
    InternshipCreate, InternshipResponse,
    HackathonCreate, HackathonResponse,
    MentorCreate, MentorResponse,
    BookingCreate, BookingResponse,
    ChatMessageCreate, ChatMessageResponse
)

app = FastAPI(title="Community Platform API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/internships", response_model=InternshipResponse)
async def create_internship(
    internship: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_internship = Internship(**internship.dict(), created_by=current_user.id)
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

@app.get("/internships", response_model=List[InternshipResponse])
async def get_internships(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    internships = db.query(Internship).offset(skip).limit(limit).all()
    return internships

@app.get("/internships/{internship_id}", response_model=InternshipResponse)
async def get_internship(internship_id: str, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

@app.post("/hackathons", response_model=HackathonResponse)
async def create_hackathon(
    hackathon: HackathonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_hackathon = Hackathon(**hackathon.dict(), created_by=current_user.id)
    db.add(db_hackathon)
    db.commit()
    db.refresh(db_hackathon)
    return db_hackathon

@app.get("/hackathons", response_model=List[HackathonResponse])
async def get_hackathons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hackathons = db.query(Hackathon).offset(skip).limit(limit).all()
    return hackathons

@app.get("/hackathons/{hackathon_id}", response_model=HackathonResponse)
async def get_hackathon(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    return hackathon

@app.post("/mentors", response_model=MentorResponse)
async def create_mentor(
    mentor: MentorCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_mentor = Mentor(**mentor.dict())
    db.add(db_mentor)
    db.commit()
    db.refresh(db_mentor)
    return db_mentor

@app.get("/mentors", response_model=List[MentorResponse])
async def get_mentors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    mentors = db.query(Mentor).offset(skip).limit(limit).all()
    return mentors

@app.get("/mentors/{mentor_id}", response_model=MentorResponse)
async def get_mentor(mentor_id: str, db: Session = Depends(get_db)):
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@app.post("/bookings", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_booking = Booking(**booking.dict(), user_id=current_user.id)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/bookings", response_model=List[BookingResponse])
async def get_user_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    return bookings

@app.post("/chat/messages", response_model=ChatMessageResponse)
async def send_message(
    message: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_message = ChatMessage(**message.dict(), sender_id=current_user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/chat/messages/{room}", response_model=List[ChatMessageResponse])
async def get_messages(
    room: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(ChatMessage.room == room).offset(skip).limit(limit).all()
    return messages
