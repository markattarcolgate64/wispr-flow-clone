# services/

Business logic layer. Services are instantiated during app lifespan and accessed via `request.app.state`.

## Files

| File | Description |
|------|-------------|
| `__init__.py` | Package marker (empty) |
| `transcription.py` | `TranscriptionService` — wraps `AsyncCartesia` client, exposes `transcribe(audio_data, filename)` for ink-whisper STT with word-level timestamps |
