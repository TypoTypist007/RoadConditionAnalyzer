"""Application configuration utilities."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings loaded from the environment."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    app_name: str = "RoadConditionAnalyzer API"
    app_version: str = "0.1.0"
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")
    cors_origins: str | list[str] = Field(
        default="*",
        description="Comma separated list of origins allowed to call the API.",
        validation_alias="CORS_ALLOW_ORIGINS",
    )

    database_url: str = Field(
        default="postgresql+psycopg://road_user:road_password@postgres:5432/road_condition",
        validation_alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://redis:6379/0", validation_alias="REDIS_URL")

    minio_endpoint: str = Field(default="http://minio:9000", validation_alias="MINIO_ENDPOINT")
    minio_root_user: str = Field(default="minioadmin", validation_alias="MINIO_ROOT_USER")
    minio_root_password: str = Field(default="minioadmin", validation_alias="MINIO_ROOT_PASSWORD")
    minio_bucket: str = Field(default="road-condition-media", validation_alias="MINIO_BUCKET")

    upload_chunk_size_mb: int = Field(default=64, validation_alias="UPLOAD_CHUNK_SIZE_MB")
    upload_max_file_size_gb: int = Field(default=12, validation_alias="UPLOAD_MAX_FILE_SIZE_GB")

    temp_video_dir: str = Field(default="/data/videos", validation_alias="TEMP_VIDEO_DIR")

    @property
    def cors_allowed_origins(self) -> List[str]:
        if isinstance(self.cors_origins, list):
            return self.cors_origins
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
