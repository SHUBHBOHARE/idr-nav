from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.app.core.config import settings
from backend.app.core.db import init_db
from backend.app.api.endpoints import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description='Backend REST API for IDR NAV - Intelligent Dead Reckoning & GNSS Fusion Engine',
    version='2.0.0'
)

# Parse FRONTEND_URL environment variable dynamically
raw_frontend_urls = os.getenv('FRONTEND_URL', '')
env_origins = [url.strip().rstrip('/') for url in raw_frontend_urls.split(',') if url.strip()]

cors_origins = list(set([
    'https://idr-nav-6db2.vercel.app',
    'https://idr-nav-937i.vercel.app',
    'https://idr-nav.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
] + env_origins))

# CORS middleware for React frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r'https://.*\.vercel\.app',
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
def startup_event():
    init_db()

app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('backend.app.main:app', host='0.0.0.0', port=8000, reload=True)
