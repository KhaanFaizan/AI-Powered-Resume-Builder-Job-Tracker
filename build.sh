#!/bin/bash

# Build script for single deployment
echo "🚀 Building AI Resume Builder for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build React frontend
echo "🏗️ Building React frontend..."
cd client
npm install
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "🎉 Ready for deployment!"
