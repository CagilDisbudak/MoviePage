from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    year = Column(Integer)
    director = Column(String)
    rating = Column(Float)
    poster_url = Column(String, nullable=True)
    trailer_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    genres = Column(String, nullable=True)  # JSON-encoded list of genres
    reviews = relationship("Review", back_populates="movie")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    reviews = relationship("Review", back_populates="user")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    rating = Column(Float)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    movie = relationship("Movie", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
