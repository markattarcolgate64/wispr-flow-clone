from cartesia import AsyncCartesia
from backend.config import settings


class TranscriptionService:
    def __init__(self):
        self.client = AsyncCartesia(api_key=settings.cartesia_api_key)
        self.model = settings.cartesia_model

    async def transcribe(self, audio_data: bytes, filename: str):
        return await self.client.stt.transcribe(
            file=(filename, audio_data, "audio/webm"),
            model=self.model,
            language="en",
            timestamp_granularities=["word"],
        )

    async def close(self):
        await self.client.close()
