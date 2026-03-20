# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ src/
COPY public/ public/
ENV VITE_API_ENDPOINT=/api/audio
RUN npm run build

# Stage 2: Install backend dependencies
FROM python:3.12-slim AS backend-deps
WORKDIR /app
COPY backend/requirements.txt .
RUN python -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Stage 3: Runtime
FROM python:3.12-slim AS runtime
WORKDIR /app
COPY --from=backend-deps /app/venv /app/venv
COPY backend/ backend/
COPY --from=frontend-build /app/dist /app/static

ENV PATH="/app/venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
