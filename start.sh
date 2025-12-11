#!/bin/bash

# Road Condition Analyzer - Quick Start Script
# This script helps users get started quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop or Docker Engine."
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose v2."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if ports are available
check_ports() {
    print_status "Checking if required ports are available..."
    
    PORTS=(80 5432 6379 9000 9001)
    CONFLICTS=()
    
    for port in "${PORTS[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            CONFLICTS+=($port)
        fi
    done
    
    if [ ${#CONFLICTS[@]} -ne 0 ]; then
        print_warning "The following ports are in use: ${CONFLICTS[*]}"
        echo "You may need to stop other services or modify docker-compose.yml"
        echo "Press Enter to continue anyway, or Ctrl+C to exit..."
        read -r
    else
        print_success "All required ports are available"
    fi
}

# Start the application
start_application() {
    print_status "Starting Road Condition Analyzer..."
    echo
    echo "This will start:"
    echo "  • Frontend (React + Vite) on http://localhost"
    echo "  • Backend (FastAPI) on http://localhost:8000"
    echo "  • Worker (Celery) for background tasks"
    echo "  • PostgreSQL database"
    echo "  • Redis cache"
    echo "  • MinIO file storage on http://localhost:9000"
    echo "  • Nginx reverse proxy"
    echo
    echo "The first startup may take a few minutes to build containers..."
    echo "Press Enter to continue or Ctrl+C to cancel..."
    read -r
    
    docker compose up --build
}

# Show completion message
show_completion() {
    echo
    print_success "Road Condition Analyzer is now running!"
    echo
    echo "Access the application:"
    echo "  🌐 Web Interface: http://localhost"
    echo "  📚 API Docs: http://localhost/docs"
    echo "  💾 File Storage: http://localhost:9001 (minioadmin/minioadmin)"
    echo
    echo "To stop the application:"
    echo "  docker compose down"
    echo
    echo "To view logs:"
    echo "  docker compose logs -f"
    echo
}

# Main execution
main() {
    echo
    echo "==================================================="
    echo "  🚗 Road Condition Analyzer - Quick Start Setup"
    echo "==================================================="
    echo
    
    check_docker
    check_ports
    start_application
    show_completion
}

# Handle Ctrl+C gracefully
trap 'echo; print_warning "Setup cancelled by user"; exit 1' INT

# Run main function
main