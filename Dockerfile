# 构建前端
FROM node:20.19.0-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock* ./
RUN yarn install
COPY frontend/public ./public
COPY frontend/src ./src
RUN yarn build

# 构建后端
FROM python:3.10-slim AS backend
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-cache
COPY backend app.py ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
EXPOSE 9989
CMD ["uv", "run", "python", "app.py"]