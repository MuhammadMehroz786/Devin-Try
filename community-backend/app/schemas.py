from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class InternshipBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    stipend: Optional[str] = None
    duration: Optional[str] = None
    apply_link: Optional[str] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipResponse(InternshipBase):
    id: str
    created_at: datetime
    created_by: str
    
    class Config:
        from_attributes = True

class HackathonBase(BaseModel):
    name: str
    organizer: str
    theme: Optional[str] = None
    deadline: Optional[datetime] = None
    register_link: Optional[str] = None
    description: Optional[str] = None

class HackathonCreate(HackathonBase):
    pass

class HackathonResponse(HackathonBase):
    id: str
    created_at: datetime
    created_by: str
    
    class Config:
        from_attributes = True

class MentorBase(BaseModel):
    name: str
    bio: Optional[str] = None
    expertise: Optional[str] = None
    profile_pic: Optional[str] = None
    available_slots: Optional[str] = None

class MentorCreate(MentorBase):
    pass

class MentorResponse(MentorBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    mentor_id: str
    session_date: datetime
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: str
    user_id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    room: str
    message: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: str
    sender_id: str
    timestamp: datetime
    
    class Config:
        from_attributes = True
