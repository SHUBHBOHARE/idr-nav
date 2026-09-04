# Multi-stage Dockerfile for IDR NAV

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend Environment
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/app /app/backend/app
COPY ai_engine /app/ai_engine
COPY navigation_engine /app/navigation_engine
COPY data /app/data

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    sqlalchemy \
    pydantic \
    numpy \
    scipy \
    scikit-learn \
    pandas \
    httpx

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000 3000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
