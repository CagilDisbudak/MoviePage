from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Movie, User, Review
import json
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Load movies from db.json
    db_json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db.json')
    with open(db_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    movies = []
    for m in data.get('movies', []):
        movie = Movie(
            title=m.get('title', ''),
            description=m.get('plot', ''),
            year=int(m.get('year', 0)) if m.get('year') else 0,
            director=m.get('director', ''),
            rating=0.0,  # No rating in db.json, set to 0
            poster_url=m.get('posterUrl', None),
            trailer_url=None,  # No trailer in db.json
            category=m.get('genres', ['Other'])[0] if m.get('genres') else 'Other',
        )
        movies.append(movie)
    db.add_all(movies)
    db.commit()
    db.close()
