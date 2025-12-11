#!/bin/bash

# Road Condition Analyzer - Installation Verification Script
# This script verifies that the installation is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Check if Docker containers are running
check_containers() {
    print_status "Checking if Docker containers are running..."
    
    CONTAINERS=("road-condition-analyzer-frontend-1" "road-condition-analyzer-backend-1" "road-condition-analyzer-worker-1" "road-condition-analyzer-postgres-1" "road-condition-analyzer-redis-1" "road-condition-analyzer-minio-1" "road-condition-analyzer-nginx-1")
    
    FAILED=()
    
    for container in "${CONTAINERS[@]}"; do
        if docker ps --filter "name=$container" --filter "status=running" | grep -q "$container"; then
            print_success "$container is running"
        else
            FAILED+=("$container")
            print_error "$container is not running"
        fi
    done
    
    if [ ${#FAILED[@]} -ne 0 ]; then
        echo
        print_error "Some containers failed to start. Run 'docker compose logs' to check for errors."
        return 1
    fi
    
    return 0
}

# Check if services are responding
check_services() {
    print_status "Checking if services are responding..."
    
    # Wait a bit for services to fully start
    sleep 5
    
    # Check frontend
    if curl -s http://localhost > /dev/null; then
        print_success "Frontend is responding on http://localhost"
    else
        print_error "Frontend is not responding on http://localhost"
    fi
    
    # Check backend health
    if curl -s http://localhost/api/health > /dev/null 2>&1; then
        print_success "Backend API is responding on http://localhost/api/health"
    else
        print_error "Backend API is not responding on http://localhost/api/health"
    fi
    
    # Check MinIO
    if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        print_success "MinIO storage is responding on http://localhost:9000"
    else
        print_error "MinIO storage is not responding on http://localhost:9000"
    fi
}

# Check system resources
check_resources() {
    print_status "Checking system resources..."
    
    # Check Docker memory usage
    CONTAINER_STATS=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "")
    
    if [ -n "$CONTAINER_STATS" ]; then
        print_success "Docker containers are using system resources"
    else
        print_warning "Could not retrieve container resource usage"
    fi
}

# Check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    AVAILABLE=$(df . | tail -1 | awk '{print $4}')
    AVAILABLE_GB=$((AVAILABLE / 1024 / 1024))
    
    if [ $AVAILABLE_GB -gt 5 ]; then
        print_success "Sufficient disk space available: ${AVAILABLE_GB}GB"
    elif [ $AVAILABLE_GB -gt 2 ]; then
        print_warning "Low disk space: ${AVAILABLE_GB}GB available"
    else
        print_error "Critical disk space: ${AVAILABLE_GB}GB available"
    fi
}

# Show useful information
show_info() {
    echo
    echo "==================================================="
    echo "  📊 Road Condition Analyzer - System Status"
    echo "==================================================="
    echo
    
    echo "🌐 Application URLs:"
    echo "  • Web Interface: http://localhost"
    echo "  • API Documentation: http://localhost/docs"
    echo "  • MinIO Console: http://localhost:9001"
    echo "  • MinIO API: http://localhost:9000"
    echo
    
    echo "🔧 Useful Commands:"
    echo "  • View logs: docker compose logs -f"
    echo "  • Stop application: docker compose down"
    echo "  • Restart: docker compose restart"
    echo "  • Check status: docker compose ps"
    echo
    
    echo "🐳 Container Status:"
    docker compose ps
    echo
    
    echo "📈 Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "Resource stats not available"
}

# Main verification process
main() {
    echo
    echo "==================================================="
    echo "  🔍 Road Condition Analyzer - Installation Verification"
    echo "==================================================="
    echo
    
    check_containers && check_services && check_disk_space
    
    echo
    show_info
}

# Run verification
main