from sqlalchemy.orm import Session
from . import models, schemas
import json
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_movies(db: Session, skip: int = 0, limit: int = 10):
    movies = db.query(models.Movie).offset(skip).limit(limit).all()
    for m in movies:
        m.genres = json.loads(m.genres) if m.genres else ['Other']
    return movies

def get_movie(db: Session, movie_id: int):
    m = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if m:
        m.genres = json.loads(m.genres) if m.genres else ['Other']
    return m

def search_movies(db: Session, query: str):
    movies = db.query(models.Movie).filter(models.Movie.title.ilike(f"%{query}%")).all()
    for m in movies:
        m.genres = json.loads(m.genres) if m.genres else ['Other']
    return movies

def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session):
    return db.query(models.User).all()

def get_user_by_username(db: Session, username: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    return user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_review(db: Session, review: schemas.ReviewCreate):
    db_review = models.Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_for_movie(db: Session, movie_id: int):
    return db.query(models.Review).filter(models.Review.movie_id == movie_id).all()
