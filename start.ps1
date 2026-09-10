# EduSmart AI Launcher Script
$env:PATH = "C:\Windows\System32;C:\Program Files\nodejs;" + $env:PATH

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "      EduSmart AI - Smart Learning & Student Success Platform" -ForegroundColor White
Write-Host "           Smart India Hackathon 2026 - AICTE Prototype" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

# Check DB
$dbPath = Join-Path $PSScriptRoot "database\edusmart.db"
if (-not (Test-Path $dbPath)) {
    Write-Host "[*] Seeding database with demo data..." -ForegroundColor Green
    python (Join-Path $PSScriptRoot "backend\database\seed.py")
}

Write-Host "[*] Launching Backend API..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python app.py"

Start-Sleep -Seconds 2

Write-Host "[*] Launching Frontend React App..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Windows\System32;C:\Program Files\nodejs;' + `$env:PATH; cd '$PSScriptRoot\frontend'; npm run dev"

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
