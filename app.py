import webbrowser
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from backend.api import router as api_router

host = "0.0.0.0"
port = 9989


@asynccontextmanager
async def lifespan(app: FastAPI):
    webbrowser.open(f"http://{host}:{port}/", new=2)
    yield


app = FastAPI(
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api", tags=["api"])
build_dir = Path("frontend/dist")


@app.get("/{full_path:path}")
async def serve_docs(full_path: str):
    if full_path == "" or full_path == "/":
        full_path = "index.html"
    full_path = build_dir / full_path
    if not full_path.exists():
        return dict(
            status_code=404,
            content={"message": "File not found"},
        )
    return FileResponse(full_path)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=host, port=port)

    # shell command to run the server:
    # uvicorn app:app --host 127.0.0.1 --port 9988 --reload
