import asyncio
import json

from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import StreamingResponse

router = APIRouter()


def sse_event(event: str, data: str) -> str:
    return f"event: {event}\ndata: {data}\n\n"


@router.post("/api/audio")
async def process_audio(request: Request, audio: UploadFile = File(...)):
    service = request.app.state.transcription_service
    audio_data = await audio.read()
    filename = audio.filename or "recording.webm"

    async def event_stream():
        try:
            yield sse_event("start", "")

            result = await service.transcribe(audio_data, filename)

            for i, word_info in enumerate(result.words or []):
                word = word_info.word.lstrip() if i == 0 else word_info.word
                yield sse_event("word", word)
                await asyncio.sleep(0.02)

            yield sse_event("done", "")

        except Exception as e:
            yield sse_event("error", str(e))

    return StreamingResponse(event_stream(), media_type="text/event-stream")
