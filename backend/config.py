from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cartesia_api_key: str
    cartesia_model: str = "ink-whisper"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    host: str = "0.0.0.0"
    port: int = 8000


settings = Settings()
