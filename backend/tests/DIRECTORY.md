# backend/tests/

Pytest test suite for the FastAPI backend. Mirrors the source directory structure.

## Files

| File | Description |
|------|-------------|
| `__init__.py` | Package marker (empty) |
| `conftest.py` | Shared fixtures: mock transcription service/result, async HTTP client, SSE parser |
| `test_config.py` | Tests for `config.py`: defaults, required key, constructor/env overrides |
| `test_main.py` | Tests for `main.py`: health endpoint, CORS, lifespan lifecycle |

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `routers/` | Tests for FastAPI route handlers |
| `services/` | Tests for business logic and external API clients |
