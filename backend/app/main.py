import os
import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud, database

app = FastAPI()

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def load_db_json():
    db_json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'db.json')
    with open(db_json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.on_event("startup")
def startup_event():
    database.init_db()

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Movie API is running!"}

@app.get("/movies", response_model=list[schemas.Movie])
def list_movies(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_movies(db, skip=skip, limit=limit)

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = crud.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@app.get("/search", response_model=list[schemas.Movie])
def search_movies(q: str, db: Session = Depends(get_db)):
    return crud.search_movies(db, q)

@app.post("/movies", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return crud.create_movie(db, movie)

@app.get("/users", response_model=list[schemas.User])
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/reviews", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, review)

@app.get("/movies/{movie_id}/reviews", response_model=list[schemas.Review])
def get_reviews_for_movie(movie_id: int, db: Session = Depends(get_db)):
    return crud.get_reviews_for_movie(db, movie_id)

@app.get("/json/movies")
def get_json_movies():
    data = load_db_json()
    return data.get("movies", [])

@app.get("/json/genres")
def get_json_genres():
    data = load_db_json()
    return data.get("genres", [])
