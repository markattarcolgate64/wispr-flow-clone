# routers/

FastAPI route handlers. Each module defines an `APIRouter` that is mounted in `main.py`.

## Files

| File | Description |
|------|-------------|
| `__init__.py` | Package marker (empty) |
| `audio.py` | `POST /api/audio` — accepts an `UploadFile`, calls `TranscriptionService.transcribe()`, streams results back as SSE events (`start`, `word`, `done`, `error`) |
