# Life Dashboard - Quick Start Guide

Write-Host "🚀 Life Dashboard Frontend - Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if node is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v16 or higher." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version: $(node --version)" -ForegroundColor Green

# Check if npm is installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm version: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open your browser to:" -ForegroundColor Yellow
Write-Host "  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📝 Available Pages:" -ForegroundColor Cyan
Write-Host "  - /login          - Login page" -ForegroundColor White
Write-Host "  - /register       - Registration page" -ForegroundColor White
Write-Host "  - /dashboard      - Main dashboard (requires auth)" -ForegroundColor White
Write-Host "  - /tasks          - Task management" -ForegroundColor White
Write-Host "  - /habits         - Habit tracker" -ForegroundColor White
Write-Host "  - /expenses       - Expense tracking" -ForegroundColor White
Write-Host "  - /calendar       - Calendar view" -ForegroundColor White
Write-Host "  - /pomodoro       - Pomodoro timer" -ForegroundColor White
Write-Host "  - /journal        - Journal entries" -ForegroundColor White
Write-Host "  - /settings       - Settings" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: You'll need a backend API running on http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
