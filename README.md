# Sketch

A web app for learning to draw. Pick a task, set a 10-minute timer, draw on paper, photograph your sketch, and get AI feedback.

## Stack

- **Frontend:** React + TypeScript + Vite → Vercel
- **Backend:** FastAPI (Python) → Railway
- **Database:** PostgreSQL via Supabase
- **Storage:** Cloudflare R2
- **AI:** Claude Vision API

## Running locally

### Backend

```bash
cd backend
cp .env.example .env   # fill in your credentials
pip install -r requirements.txt
python seed_tasks.py   # populate drawing tasks
uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/tasks` | List drawing tasks |
| POST | `/sketches/upload` | Upload sketch, get feedback |
| GET | `/sketches/history` | User's sketch history |

## Environment variables

See `backend/.env.example` and `frontend/.env.example`.
