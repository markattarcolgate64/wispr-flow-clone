# backend/

Python FastAPI server that accepts audio uploads and returns streaming SSE transcription using Cartesia's ink-whisper speech-to-text model.

## Files

| File | Description |
|------|-------------|
| `__init__.py` | Package marker (empty) |
| `config.py` | Pydantic Settings: loads `cartesia_api_key`, `cartesia_model`, CORS origins, host, and port from `.env` |
| `main.py` | FastAPI app entry point: CORS middleware, lifespan (creates/closes TranscriptionService), health endpoint, mounts audio router |
| `requirements.txt` | Python dependencies: FastAPI, uvicorn, python-multipart, cartesia, pydantic-settings, pytest, pytest-asyncio, httpx |
| `pytest.ini` | Pytest configuration: async mode auto, test paths, Python path |

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `routers/` | FastAPI route handlers |
| `services/` | Business logic and external API clients |
| `tests/` | Pytest test suite mirroring source structure |
