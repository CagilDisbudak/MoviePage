import os
import json
import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
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

SECRET_KEY = "supersecretkey"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Utility to create JWT token
def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Utility to verify password
def verify_password(plain_password, hashed_password):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)

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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

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

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user)

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected")
def protected_route(current_user: schemas.User = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.username}! This is a protected endpoint."}

@app.get("/me", response_model=schemas.User)
def me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.post("/logout")
def logout():
    # Stateless JWT: logout is handled on frontend by deleting token
    return {"message": "Logged out (client should delete token)"}

# Example of a role-protected endpoint
@app.get("/admin-only")
def admin_only(current_user: schemas.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only!")
    return {"message": f"Welcome, admin {current_user.username}!"}

@app.get("/json/movies")
def get_json_movies():
    data = load_db_json()
    movies = data.get("movies", [])
    for m in movies:
        if 'genres' not in m or not m['genres']:
            m['genres'] = ['Other']
    return movies

@app.get("/json/genres")
def get_json_genres():
    data = load_db_json()
    return data.get("genres", [])
