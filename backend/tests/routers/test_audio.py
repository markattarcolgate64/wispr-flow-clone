from backend.routers.audio import sse_event
from tests.conftest import parse_sse_events


def test_sse_event_formats_correctly():
    assert sse_event("word", "hello") == "event: word\ndata: hello\n\n"


def test_sse_event_empty_data():
    assert sse_event("start", "") == "event: start\ndata: \n\n"


async def test_successful_transcription_stream(async_client):
    resp = await async_client.post(
        "/api/audio",
        files={"audio": ("test.webm", b"fake-audio-data", "audio/webm")},
    )
    assert resp.status_code == 200

    events = parse_sse_events(resp.text)
    event_types = [e[0] for e in events]
    assert "start" in event_types
    assert "done" in event_types
    assert "error" not in event_types

    word_events = [e[1] for e in events if e[0] == "word"]
    assert word_events[0] == "Hello"  # leading space lstripped
    assert word_events[1] == " world"


async def test_transcription_error_stream(async_client, mock_transcription_service):
    mock_transcription_service.transcribe.side_effect = RuntimeError("API failed")

    resp = await async_client.post(
        "/api/audio",
        files={"audio": ("test.webm", b"fake-audio-data", "audio/webm")},
    )
    assert resp.status_code == 200

    events = parse_sse_events(resp.text)
    event_types = [e[0] for e in events]
    assert "start" in event_types
    assert "error" in event_types
    assert "done" not in event_types

    error_data = [e[1] for e in events if e[0] == "error"]
    assert "API failed" in error_data[0]


async def test_missing_file_returns_422(async_client):
    resp = await async_client.post("/api/audio")
    assert resp.status_code == 422
