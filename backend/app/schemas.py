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

class User(UserBase):
    id: int
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

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    reviews: List[Review] = []
    class Config:
        orm_mode = True
