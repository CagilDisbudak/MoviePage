from sqlalchemy.orm import Session
from . import models, schemas

def get_movies(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Movie).offset(skip).limit(limit).all()

def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

def search_movies(db: Session, query: str):
    return db.query(models.Movie).filter(models.Movie.title.ilike(f"%{query}%")).all()

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

def create_review(db: Session, review: schemas.ReviewCreate):
    db_review = models.Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_for_movie(db: Session, movie_id: int):
    return db.query(models.Review).filter(models.Review.movie_id == movie_id).all()
