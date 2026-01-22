#!/bin/bash

# StreamView Studio Clone - Environment Setup Script
# This script starts the frontend and backend servers for development

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPEC_DIR="$PROJECT_ROOT/.spec"
LOGS_DIR="$SPEC_DIR/logs"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Create logs directory if it doesn't exist
mkdir -p "$LOGS_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -i ":$port" >/dev/null 2>&1
    return $?
}

# Function to stop servers
stop_servers() {
    echo -e "${YELLOW}Stopping servers...${NC}"

    # Stop frontend (port 5173)
    if check_port 5173; then
        echo "Stopping frontend server..."
        pkill -f "vite" || true
        sleep 1
    fi

    # Stop backend (port 8000)
    if check_port 8000; then
        echo "Stopping backend server..."
        pkill -f "uvicorn app.main:app" || true
        sleep 1
    fi

    echo -e "${GREEN}Servers stopped.${NC}"
}

# Function to start servers
start_servers() {
    echo -e "${GREEN}=== StreamView Studio Clone - Starting Servers ===${NC}"
    echo ""

    # Check if already running
    if check_port 5173 && check_port 8000; then
        echo -e "${GREEN}Servers are already running!${NC}"
        echo ""
        echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
        echo -e "Backend API: ${GREEN}http://localhost:8000/api${NC}"
        echo -e "API Docs: ${GREEN}http://localhost:8000/api/docs${NC}"
        echo ""
        echo "Run './.spec/init.sh stop' to stop the servers."
        return 0
    fi

    # Install frontend dependencies if needed
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        cd "$FRONTEND_DIR"
        npm install
    fi

    # Install backend dependencies if needed
    if [ ! -d "$BACKEND_DIR/.venv" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        cd "$BACKEND_DIR"
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
    fi

    # Start backend server
    echo -e "${YELLOW}Starting backend server...${NC}"
    cd "$BACKEND_DIR"
    source .venv/bin/activate
    nohup uvicorn app.main:app --reload --port 8000 > "$LOGS_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"

    # Wait for backend to start
    echo "Waiting for backend to start..."
    for i in {1..30}; do
        if check_port 8000; then
            echo -e "${GREEN}Backend started successfully!${NC}"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            echo -e "${RED}Backend failed to start. Check logs at $LOGS_DIR/backend.log${NC}"
            exit 1
        fi
    done

    # Start frontend server
    echo -e "${YELLOW}Starting frontend server...${NC}"
    cd "$FRONTEND_DIR"
    nohup npm run dev -- --host --port 5173 > "$LOGS_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"

    # Wait for frontend to start
    echo "Waiting for frontend to start..."
    for i in {1..30}; do
        if check_port 5173; then
            echo -e "${GREEN}Frontend started successfully!${NC}"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            echo -e "${RED}Frontend failed to start. Check logs at $LOGS_DIR/frontend.log${NC}"
            exit 1
        fi
    done

    echo ""
    echo -e "${GREEN}=== All servers are running! ===${NC}"
    echo ""
    echo -e "Frontend (StreamView Studio): ${GREEN}http://localhost:5173${NC}"
    echo -e "Backend API: ${GREEN}http://localhost:8000/api${NC}"
    echo -e "API Docs (Swagger): ${GREEN}http://localhost:8000/api/docs${NC}"
    echo ""
    echo "Logs are saved to:"
    echo "  Frontend: $LOGS_DIR/frontend.log"
    echo "  Backend: $LOGS_DIR/backend.log"
    echo ""
    echo "To stop the servers, run: ./.spec/init.sh stop"
    echo ""
}

# Main script logic
case "${1:-}" in
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 2
        start_servers
        ;;
    *)
        start_servers
        ;;
esac
