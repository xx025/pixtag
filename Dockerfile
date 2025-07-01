FROM node:20.19.0-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/  /app/frontend/
RUN yarn install
RUN yarn build

FROM python:3.10-slim AS backend
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/
WORKDIR /app
COPY pyproject.toml uv.lock ./
COPY backend app.py ./
RUN uv sync
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
EXPOSE 9989
CMD ["uv", "run", "python", "app.py"]