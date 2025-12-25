# Deployment Guide

This guide covers various deployment options for the Todo App (FastAPI backend + React frontend).

## Quick Reference

| Component | Recommended Options |
|-----------|---------------------|
| **Backend** | Render, Railway, Fly.io, DigitalOcean App Platform |
| **Frontend** | Vercel, Netlify, Cloudflare Pages |
| **Database** | PostgreSQL (recommended for production), SQLite (dev only) |
| **Full Stack** | Railway, Render, Fly.io (deploy both together) |

---

## 1. Backend Deployment Options

### Option A: Render (Recommended - Free Tier Available)

**Pros:** Free tier, easy PostgreSQL setup, automatic HTTPS

1. **Create `render.yaml` in backend folder:**
```yaml
services:
  - type: web
    name: todo-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
```

2. **On Render Dashboard:**
   - Connect your GitHub repo
   - Create new Web Service
   - Select backend folder
   - Add environment variable: `DATABASE_URL` (Render provides PostgreSQL)
   - Deploy!

**Database Setup:**
- Render offers free PostgreSQL
- Update `backend/database.py` to use PostgreSQL:
```python
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
```

### Option B: Railway

**Pros:** Simple, includes PostgreSQL, good free tier

1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `railway init` in backend folder
3. Add PostgreSQL plugin in Railway dashboard
4. Update database URL (Railway auto-injects `DATABASE_URL`)
5. Deploy: `railway up`

### Option C: Fly.io

**Pros:** Global distribution, Docker-based

1. Install Fly CLI
2. Run: `fly launch` in backend folder
3. Follow prompts
4. Add PostgreSQL: `fly postgres create`
5. Attach DB: `fly postgres attach <db-name>`
6. Deploy: `fly deploy`

### Option D: DigitalOcean App Platform

**Pros:** Reliable, includes managed databases

1. Connect GitHub repo
2. Create App
3. Select backend folder
4. Add managed PostgreSQL database
5. Set environment variables
6. Deploy

---

## 2. Frontend Deployment Options

### Option A: Vercel (Recommended - Free Tier)

**Pros:** Zero config, automatic HTTPS, great for React

1. Install Vercel CLI: `npm i -g vercel`
2. In frontend folder: `vercel`
3. Or connect GitHub repo on vercel.com
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. **Important:** Add environment variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://your-backend.onrender.com`)

**Update `frontend/src/App.jsx`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api/todos'
```

**Update `frontend/vite.config.js`:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### Option B: Netlify

**Pros:** Free tier, easy setup, form handling

1. Install Netlify CLI: `npm i -g netlify-cli`
2. In frontend folder: `netlify deploy --prod`
3. Or connect GitHub repo on netlify.com
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL`

### Option C: Cloudflare Pages

**Pros:** Fast CDN, free tier

1. Connect GitHub repo on Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_API_URL`

---

## 3. Database Migration (SQLite → PostgreSQL)

For production, use PostgreSQL instead of SQLite.

### Update `backend/database.py`:

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Use environment variable or fallback to SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

# Handle Render's postgres:// URL (needs postgresql://)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs special connection args
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Update `backend/requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
psycopg2-binary==2.9.9  # PostgreSQL driver
```

---

## 4. Docker Deployment (Full Stack)

### Create `Dockerfile` in backend folder:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/todos
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=todos
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Deploy with Docker:**
- Local: `docker-compose up`
- Cloud: Deploy to any Docker host (DigitalOcean, AWS ECS, Google Cloud Run, etc.)

---

## 5. Recommended Deployment Strategy

### For Beginners:
1. **Backend:** Render (free PostgreSQL included)
2. **Frontend:** Vercel (free, easy)
3. **Total Cost:** $0

### For Production:
1. **Backend:** Railway or DigitalOcean App Platform
2. **Frontend:** Vercel or Cloudflare Pages
3. **Database:** Managed PostgreSQL (included with platform)
4. **Cost:** ~$5-20/month

### Steps:

1. **Deploy Backend:**
   - Push code to GitHub
   - Deploy to Render/Railway
   - Note the backend URL

2. **Update Frontend:**
   - Set `VITE_API_URL` environment variable
   - Update CORS in backend to allow frontend domain

3. **Update Backend CORS:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app",  # Your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. **Deploy Frontend:**
   - Push to GitHub
   - Deploy to Vercel/Netlify
   - Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## 6. Environment Variables Checklist

### Backend:
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by most platforms)
- `CORS_ORIGINS` - Frontend URLs (optional, can hardcode)

### Frontend:
- `VITE_API_URL` - Backend API URL (e.g., `https://api.yourdomain.com`)

---

## 7. Quick Deploy Commands

### Render:
```bash
# Just push to GitHub and connect on Render dashboard
git push origin main
```

### Railway:
```bash
railway login
railway init
railway up
```

### Vercel:
```bash
cd frontend
vercel --prod
```

### Netlify:
```bash
cd frontend
netlify deploy --prod
```

---

## 8. Post-Deployment Checklist

- [ ] Backend is accessible via HTTPS
- [ ] Frontend environment variable is set
- [ ] CORS is configured correctly
- [ ] Database is migrated (SQLite → PostgreSQL)
- [ ] Test all CRUD operations
- [ ] Check error handling
- [ ] Verify statistics endpoint works
- [ ] Test search functionality
- [ ] Check responsive design on mobile

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

