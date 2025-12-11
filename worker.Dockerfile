# syntax=docker/dockerfile:1.6
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_HOME=/workspace/backend

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 \
      python3-pip \
      python3-venv \
      build-essential \
      curl && \
    rm -rf /var/lib/apt/lists/* && \
    ln -s /usr/bin/python3 /usr/bin/python

RUN python3 -m venv /opt/venv && /opt/venv/bin/pip install --upgrade pip setuptools wheel
ENV PATH="/opt/venv/bin:${PATH}"

WORKDIR ${APP_HOME}

COPY backend/pyproject.toml backend/README.md ./
COPY backend/app ./app

RUN pip install --no-cache-dir -e .

RUN mkdir -p /data/videos

CMD ["celery", "-A", "app.core.celery_app", "worker", "--loglevel=info"]
