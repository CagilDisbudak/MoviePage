from pydantic import BaseModel
from typing import List, Optional

class ReviewBase(BaseModel):
    text: str
    rating: float
    user_id: int

class ReviewCreate(ReviewBase):
    movie_id: int

class Review(ReviewBase):
    id: int
    movie_id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class User(BaseModel):
    id: int
    username: str
    role: str
    class Config:
        orm_mode = True

class MovieBase(BaseModel):
    title: str
    description: str
    year: int
    director: str
    rating: float
    poster_url: Optional[str] = None
    trailer_url: Optional[str] = None
    category: Optional[str] = None
    genres: Optional[List[str]] = None  # Add genres as a list of strings

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    reviews: List[Review] = []
    class Config:
        orm_mode = True
