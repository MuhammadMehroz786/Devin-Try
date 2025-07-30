from sqlalchemy import create_engine, Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

SQLALCHEMY_DATABASE_URL = "sqlite:///./community_platform.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="user")  # user, mentor, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    
    internships = relationship("Internship", back_populates="creator")
    hackathons = relationship("Hackathon", back_populates="creator")
    chat_messages = relationship("ChatMessage", back_populates="sender")
    bookings = relationship("Booking", back_populates="user")

class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String)
    stipend = Column(String)
    duration = Column(String)
    apply_link = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, ForeignKey("users.id"))
    
    creator = relationship("User", back_populates="internships")

class Hackathon(Base):
    __tablename__ = "hackathons"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    organizer = Column(String, nullable=False)
    theme = Column(String)
    deadline = Column(DateTime)
    register_link = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, ForeignKey("users.id"))
    
    creator = relationship("User", back_populates="hackathons")

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    bio = Column(Text)
    expertise = Column(String)
    profile_pic = Column(String)
    available_slots = Column(String)  # JSON string for simplicity
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="mentor")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(String, ForeignKey("mentors.id"), nullable=False)
    session_date = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, cancelled
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    mentor = relationship("Mentor", back_populates="bookings")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    room = Column(String, nullable=False)  # channel name or DM identifier
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    sender = relationship("User", back_populates="chat_messages")

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
