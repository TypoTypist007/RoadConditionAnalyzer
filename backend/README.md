# RoadConditionAnalyzer Backend

This directory contains the FastAPI application, shared configuration, and Celery worker entrypoints that power the RoadConditionAnalyzer stack. It is packaged as an installable module via `pyproject.toml` so both the API service and worker containers can share the same code and dependencies.
