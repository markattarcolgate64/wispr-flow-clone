import os

os.environ.setdefault("CARTESIA_API_KEY", "test-api-key-fake")

from unittest.mock import AsyncMock, MagicMock

import httpx
import pytest
from httpx import ASGITransport

from backend.main import app


def parse_sse_events(body: str) -> list[tuple[str, str]]:
    """Parse SSE text into [(event_type, data), ...]."""
    events = []
    event_type = ""
    for line in body.split("\n"):
        if line.startswith("event: "):
            event_type = line[len("event: "):]
        elif line.startswith("data: "):
            events.append((event_type, line[len("data: "):]))
        elif line == "data: ":
            events.append((event_type, ""))
    return events


@pytest.fixture
def mock_transcription_result():
    word1 = MagicMock()
    word1.word = " Hello"
    word2 = MagicMock()
    word2.word = " world"
    result = MagicMock()
    result.words = [word1, word2]
    return result


@pytest.fixture
def mock_transcription_service(mock_transcription_result):
    service = AsyncMock()
    service.transcribe.return_value = mock_transcription_result
    service.close.return_value = None
    return service


@pytest.fixture
async def async_client(mock_transcription_service):
    app.state.transcription_service = mock_transcription_service
    transport = ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
