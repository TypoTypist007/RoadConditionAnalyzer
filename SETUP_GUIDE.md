# Road Condition Analyzer - Setup Guide

## Quick Start (Recommended)

### Prerequisites
- **Docker Desktop** (Windows/Mac) or **Docker Engine + Docker Compose** (Linux)
- **Git** (optional, for version control)

### Installation Steps

1. **Extract the downloaded archive**
   ```bash
   tar -xzf road-condition-analyzer.tar.gz
   cd road-condition-analyzer
   ```

2. **Start the application**
   ```bash
   # Option 1: Using Docker Compose directly
   docker compose up --build

   # Option 2: Using the Makefile (if available)
   make build   # Build all Docker images
   make up      # Start all services
   ```

3. **Access the application**
   - Web Interface: http://localhost
   - API Health: http://localhost/api/health
   - MinIO Console: http://localhost:9001 (admin/minioadmin)

## Manual Setup (Advanced)

If you want to run components individually:

### Backend Only
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Only
```bash
npm install
npm run dev
```

### Infrastructure Services Only
```bash
docker compose up postgres redis minio nginx
```

## Environment Configuration

### Default Environment Files
The project includes default environment configurations in the `env/` directory:
- `backend.env` - FastAPI and Celery configuration
- `worker.env` - Celery worker settings
- `frontend.env` - React build settings
- `postgres.env` - Database configuration
- `minio.env` - Object storage configuration

### Custom Configuration
To customize settings:
1. Copy any env file: `cp env/backend.env env/backend.local`
2. Edit the `.local` file with your preferences
3. Update `docker-compose.yml` to reference your custom file

## System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **Storage**: 10GB free space
- **CPU**: 2 cores (4+ cores recommended)

### For GPU Acceleration (Optional)
- NVIDIA GPU with CUDA support
- NVIDIA Container Toolkit installed
- Docker with GPU access enabled

## Troubleshooting

### Port Conflicts
If ports are in use, modify `docker-compose.yml`:
```yaml
services:
  nginx:
    ports:
      - "8080:80"  # Change from 80 to 8080
```

### Memory Issues
For low-memory systems, reduce worker counts in `env/backend.env`:
```bash
UVICORN_WORKERS=1  # Reduce from 2
```

### Service Logs
View logs for troubleshooting:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f worker
```

### Reset Everything
```bash
docker compose down -v  # Remove all containers and volumes
docker system prune -a  # Clean up unused resources
```

## Project Structure
```
road-condition-analyzer/
├── backend/              # FastAPI application
├── src/                  # React frontend source
├── env/                  # Environment configurations
├── nginx/                # Reverse proxy setup
├── docker-compose.yml    # Service orchestration
├── Makefile             # Helper commands
└── SETUP_GUIDE.md       # This file
```

## Development

### Hot Reloading
- Frontend: Changes auto-reload in development
- Backend: Auto-reloads with `--reload` flag
- Worker: Requires restart for code changes

### Database Access
```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U road_user -d road_condition

# Connect to Redis
docker compose exec redis redis-cli
```

### File Storage
Files are stored in MinIO at `http://localhost:9000` with console access at `http://localhost:9001`.

## Support

If you encounter issues:
1. Check Docker and Docker Compose versions
2. Ensure all ports (80, 5432, 6379, 9000, 9001) are available
3. Verify sufficient disk space and memory
4. Check service logs for specific error messages

For detailed API documentation, visit http://localhost/docs after starting the application.