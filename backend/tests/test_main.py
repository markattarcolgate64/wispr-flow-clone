from unittest.mock import AsyncMock, patch

from backend.main import app, lifespan


async def test_health_returns_ok(async_client):
    resp = await async_client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


async def test_cors_allowed_origin(async_client):
    resp = await async_client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:5173"


async def test_cors_disallowed_origin(async_client):
    resp = await async_client.options(
        "/health",
        headers={
            "Origin": "http://evil.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert "access-control-allow-origin" not in resp.headers


async def test_lifespan_creates_and_closes_service():
    mock_service = AsyncMock()
    mock_service.close.return_value = None

    with patch("backend.main.TranscriptionService", return_value=mock_service):
        async with lifespan(app):
            assert app.state.transcription_service is mock_service
        mock_service.close.assert_awaited_once()
