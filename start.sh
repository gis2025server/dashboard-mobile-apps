#!/bin/bash

echo "========================================"
echo "Starting Dashboard & Mobile Apps Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./databases
UPLOAD_PATH=./uploads
EXCEL_UPLOAD_PATH=./uploads/excel
IMAGE_UPLOAD_PATH=./uploads/images
SYNC_SCHEDULE_1=0 12 * * *
SYNC_SCHEDULE_2=0 18 * * *
DEFAULT_ADMIN_USERNAME=admin-gis
DEFAULT_ADMIN_PASSWORD=gis2026
NODE_ENV=development
EOF
    echo ".env file created!"
    echo ""
fi

echo "Starting server..."
echo ""
node server/index.js
