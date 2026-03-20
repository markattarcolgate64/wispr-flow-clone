# Wispr Flow Clone

React 19 + TypeScript + Vite frontend, Python FastAPI backend.

## Testing

All new components and features must include corresponding test files.

### Running tests
- `npm test` — run all tests
- `npm run test:watch` — watch mode
- `npm run test:coverage` — with coverage report

### Conventions
- Test files go in `src/__tests__/` mirroring the source directory structure (e.g., `src/components/Foo.tsx` → `src/__tests__/components/Foo.test.tsx`)
- Use `@testing-library/react` for component rendering
- Use `@testing-library/user-event` for user interactions
- Mock browser APIs using factories in `src/__tests__/mocks/`
- Mock module imports with `jest.mock()` (e.g., `jest.mock("../../streaming/transport")`)

### What to test
- Render output for prop combinations
- User interactions and callbacks
- State transitions
- Error states
- Disabled/enabled states

### What NOT to test
- CSS styling details
- Implementation internals
- Third-party library behavior

## Backend Testing

### Running backend tests
- `npm run test:backend` — backend only (pytest)
- `npm run test:all` — full monorepo suite (frontend Jest + backend pytest)
- `cd backend && pytest -v` — run directly

### Backend test conventions
- Framework: pytest + pytest-asyncio (async mode auto)
- Endpoint tests use `httpx.AsyncClient` with `ASGITransport`
- Always mock the Cartesia API — never make real API calls in tests
- Test files mirror source structure under `backend/tests/` (e.g., `backend/services/transcription.py` → `backend/tests/services/test_transcription.py`)
- Shared fixtures live in `backend/tests/conftest.py`

## Docker

### Building and running
- `docker build -t wispr-flow .` — build the image
- `docker run -p 8000:8000 --env-file .env wispr-flow` — run the container
- `docker compose up` — build and run via Compose (reads `.env` automatically)

### How it works
- 3-stage multi-stage build: Node (frontend build) → Python (pip install) → Python slim (runtime)
- FastAPI serves the Vite-built SPA via a conditional `StaticFiles` mount at `/`
- API routes (`/api/audio`, `/health`) are registered before the mount, so they take priority
- The static mount only activates when `/app/static` exists (i.e., inside Docker) — local dev is unaffected

## Directory Documentation

Every source directory contains a `DIRECTORY.md` file that describes the purpose of that directory and each file/subdirectory within it.

### Reading DIRECTORY.md files
- When navigating to a new directory, read its `DIRECTORY.md` first to understand what lives there and why.
- Use these files to orient yourself before reading individual source files.
- If a `DIRECTORY.md` is missing or seems outdated, flag it and update it.

### Updating DIRECTORY.md files
When you make changes to the codebase, update the relevant `DIRECTORY.md` files to reflect those changes:
- **Adding a file**: Add a row to the Files table in the parent directory's `DIRECTORY.md`.
- **Removing a file**: Remove its row from the Files table.
- **Adding a directory**: Add a row to the Subdirectories table and create a new `DIRECTORY.md` inside the new directory.
- **Removing a directory**: Remove its Subdirectories row and delete its `DIRECTORY.md`.
- **Renaming or changing a file's purpose**: Update the description in the Files table.
- **Changing a directory's purpose**: Update both the Subdirectories entry in the parent and the purpose statement in its own `DIRECTORY.md`.
