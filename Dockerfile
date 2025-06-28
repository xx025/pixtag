# 第一阶段：使用 Node.js 20.19.0 构建前端静态文件
FROM node:20.19.0-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app/frontend

# 复制前端代码
COPY frontend/package.json frontend/yarn.lock* ./
COPY frontend/ ./

# 安装依赖并构建
RUN yarn install && yarn build

# 第二阶段：使用 uv 构建 Python 镜像
FROM python:3.10-slim AS backend

# 安装 uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# 设置工作目录
WORKDIR /app

# 复制 Python 项目文件
COPY pyproject.toml uv.lock ./

# 使用 uv 安装依赖
RUN uv sync --frozen --no-cache

# 复制应用代码
COPY . .

# 从第一阶段复制构建好的静态文件
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 暴露端口
EXPOSE 9989

# 使用 uv 运行应用
CMD ["uv", "run", "python", "app.py"] 