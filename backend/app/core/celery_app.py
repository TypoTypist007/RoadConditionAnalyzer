"""Celery application instance that reuses the FastAPI settings."""

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "roadcondition",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.task_default_queue = "default"
celery_app.conf.task_default_exchange = "roadcondition"
celery_app.conf.task_default_routing_key = "roadcondition.default"
celery_app.conf.worker_prefetch_multiplier = 1


@celery_app.task(name="health.check")
def health_check() -> dict[str, str]:
    """Minimal task used for readiness checks."""
    return {"status": "ok"}
