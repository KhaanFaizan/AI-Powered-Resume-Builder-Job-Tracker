@echo off
echo 🚀 Building AI Resume Builder for production...

echo 📦 Installing dependencies...
npm install

echo 🏗️ Building React frontend...
cd client
npm install
npm run build
cd ..

echo ✅ Build completed successfully!
echo 🎉 Ready for deployment!
