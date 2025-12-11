# RoadConditionAnalyzer

RoadConditionAnalyzer is a Vite + React single-page application backed by a FastAPI service and Celery worker. The stack is fully containerized so the frontend, API, worker, and infrastructure dependencies (Postgres, Redis, MinIO, and Nginx) can be developed or deployed together with a single `docker compose up`.

## Repository layout

```
.
├── backend/                 # FastAPI app, Celery wiring, and NVIDIA-enabled Dockerfile
├── env/                     # Service-specific environment defaults consumed by docker compose
├── nginx/                   # Reverse-proxy configuration that fronts the SPA + API
├── frontend.Dockerfile      # Multi-stage Vite build that serves static assets via nginx
├── worker.Dockerfile        # Celery worker image that reuses backend code & dependencies
├── docker-compose.yml       # All services wired together with health checks and volumes
└── src/                     # React UI source code (Vite entry lives at project root)
```

## Prerequisites

- Docker 24.x (or newer) and Docker Compose v2 (`docker compose version`).
- Node.js 20+ if you want to run the frontend outside containers (optional).
- NVIDIA GPU support (optional): install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) so containers launched from the CUDA base image can access your GPU. When starting GPU-aware services manually, append `--gpus all`, e.g. `docker compose run --rm --gpus all backend python -c "import torch; print(torch.cuda.is_available())"`.

## Environment variables

1. Global defaults live in [`.env.example`](./.env.example). Copy it to `.env` if you want to override any value without editing tracked files.
2. Each container also pulls in the files under `env/`:
   - `env/backend.env` and `env/worker.env` define the FastAPI / Celery configuration, DB DSN, Redis URL, MinIO credentials + bucket, chunk sizes, and upload limits.
   - `env/frontend.env` provides Vite build-time values (API base path, upload limit hints).
   - `env/postgres.env` and `env/minio.env` seed the infrastructure services with deterministic development credentials.

All secrets shown in these files are for local development only. For production deployments, create your own copies (e.g. `env/backend.local`) and either update the compose file to reference them or export overrides via your `.env` before running compose.

## Bringing the stack online

```bash
# Build all images (frontend, backend, worker) and start every dependency
docker compose up --build

# or use the helper targets in the Makefile
make build   # docker compose build
make up      # docker compose up --build
make down    # docker compose down -v (stop everything and remove volumes)
```

Once the containers report healthy:

- `http://localhost` → served by Nginx, proxies static assets from the frontend container.
- `http://localhost/api/health` → FastAPI health endpoint proxied through Nginx (direct container URL is `http://localhost:8000/health`).
- `http://localhost:9001` → MinIO console (user/pass from `env/minio.env`).

### GPU usage

The backend and worker images are built from `nvidia/cuda:12.2.0-runtime-ubuntu22.04`. If the NVIDIA runtime is installed, you can expose your GPU to those services by launching them with:

```bash
docker compose up --build backend worker --detach --no-deps --gpus all
```

(Or add `--gpus all` to individual `docker compose run` commands.) Without GPUs, the containers gracefully fall back to CPU-only execution.

### Persistent volumes

- `postgres_data` → mounted at `/var/lib/postgresql/data` to preserve DB state.
- `minio_data` → mounted at `/data` so uploaded artifacts persist between restarts.
- `video_scratch` → mounted at `/data/videos` inside the backend + worker containers for temporary chunked uploads and processing.

## Troubleshooting

- Make sure ports `80`, `5432`, `6379`, `9000`, and `9001` are free before starting the stack.
- If you change any environment values, restart the affected services: `docker compose up -d --build backend worker`.
- View logs with `docker compose logs -f <service>` (e.g. `backend`, `worker`, or `nginx`).
- MinIO buckets are not auto-created. Use the MinIO console or `mc` CLI to create the bucket defined in `MINIO_BUCKET` before attempting uploads.
- If the API returns CORS errors, update `CORS_ALLOW_ORIGINS` in `.env` or `env/backend.env` to include your hostnames.

With this baseline in place, both the FastAPI backend and the React frontend can evolve independently while still sharing a reproducible, production-like runtime.
