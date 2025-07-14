# Filmax

A modern, full-stack movie review and discovery web application.

---

## Features
- Browse, search, and filter movies by genre
- Modern Netflix-inspired UI with responsive design
- Movie detail modal with trailer player
- Pagination and genre navigation (including dropdown)
- FastAPI backend with SQLite database
- React + TypeScript frontend

---

## Project Structure

```
MovieProject/
  backend/      # FastAPI backend
    app/
      main.py
      models.py
      schemas.py
      crud.py
      database.py
    requirements.txt
  frontend/     # React + TypeScript frontend
    src/
    public/
    package.json
    README.md
```

---

## Backend Setup (FastAPI)

### Requirements
- Python 3.11+
- pip

### Install dependencies
```
cd backend
pip install -r requirements.txt
```

### Run the backend server
```
cd backend
uvicorn app.main:app --reload
```
- The API will be available at [http://localhost:8000](http://localhost:8000)
- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Backend requirements (from requirements.txt)
- fastapi
- uvicorn
- sqlalchemy
- passlib[bcrypt]
- python-jose
- pydantic

---

## Frontend Setup (React + TypeScript)

### Requirements
- Node.js (v16+ recommended)
- npm

### Install dependencies
```
cd frontend
npm install
```

### Run the frontend
```
cd frontend
npm start
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

### Frontend requirements (from package.json)
- react
- react-dom
- react-router-dom
- react-scripts
- typescript
- @types/react, @types/react-dom, @types/node
- @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @testing-library/dom
- web-vitals

---

## Usage
- The frontend fetches movies from the backend at `http://localhost:8000/movies`.
- You can browse by genre, search, and view details/trailers for each movie.
- To add more movies, update the backend database or the `db.json` file and restart the backend.

---

## Customization
- To change the site icon, replace `frontend/public/favicon.ico`.
- To change the app name, edit `frontend/public/index.html` and the header in `App.tsx`.

---

## License
MIT (or specify your license here) 