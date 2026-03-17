import os

import pytest
from pydantic import ValidationError

from backend.config import Settings


def test_defaults_applied():
    s = Settings(cartesia_api_key="key")
    assert s.cartesia_model == "ink-whisper"
    assert s.cors_origins == ["http://localhost:5173", "http://127.0.0.1:5173"]
    assert s.host == "0.0.0.0"
    assert s.port == 8000


def test_api_key_required(monkeypatch):
    monkeypatch.delenv("CARTESIA_API_KEY", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_override_via_constructor():
    s = Settings(cartesia_api_key="key", cartesia_model="custom-model", port=9000)
    assert s.cartesia_model == "custom-model"
    assert s.port == 9000


def test_override_via_env_vars(monkeypatch):
    monkeypatch.setenv("CARTESIA_API_KEY", "env-key")
    monkeypatch.setenv("CARTESIA_MODEL", "env-model")
    monkeypatch.setenv("PORT", "3000")
    s = Settings(_env_file=None)
    assert s.cartesia_api_key == "env-key"
    assert s.cartesia_model == "env-model"
    assert s.port == 3000
