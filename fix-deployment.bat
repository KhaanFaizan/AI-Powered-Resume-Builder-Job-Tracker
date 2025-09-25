@echo off
echo Fixing deployment ESLint errors...
git add client/src/components/AdminDashboard.js client/src/components/LoginForm.js
git commit -m "Fix ESLint errors: escape apostrophes in AdminDashboard and LoginForm components"
git push origin main
echo Changes pushed successfully!
pause
