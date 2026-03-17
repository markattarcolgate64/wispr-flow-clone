from unittest.mock import AsyncMock, MagicMock, patch

from backend.services.transcription import TranscriptionService


def test_init_creates_client_with_api_key():
    with patch("backend.services.transcription.AsyncCartesia") as MockCartesia:
        mock_client = MagicMock()
        MockCartesia.return_value = mock_client

        service = TranscriptionService()

        MockCartesia.assert_called_once_with(api_key="test-api-key-fake")
        assert service.model == "ink-whisper"
        assert service.client is mock_client


async def test_transcribe_calls_client_correctly():
    with patch("backend.services.transcription.AsyncCartesia") as MockCartesia:
        mock_client = AsyncMock()
        MockCartesia.return_value = mock_client

        service = TranscriptionService()
        audio_data = b"test-audio"
        filename = "test.webm"

        await service.transcribe(audio_data, filename)

        mock_client.stt.transcribe.assert_awaited_once_with(
            file=(filename, audio_data, "audio/webm"),
            model="ink-whisper",
            language="en",
            timestamp_granularities=["word"],
        )


async def test_close_closes_client():
    with patch("backend.services.transcription.AsyncCartesia") as MockCartesia:
        mock_client = AsyncMock()
        MockCartesia.return_value = mock_client

        service = TranscriptionService()
        await service.close()

        mock_client.close.assert_awaited_once()
