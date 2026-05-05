Write-Host ""
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "  Voice Diary - Setup" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host ""

# 1. Node deps
Write-Host "[1/4] Installing Node dependencies..." -ForegroundColor Yellow
npm install
Write-Host "Done - Node deps" -ForegroundColor Green
Write-Host ""

# 2. .env
if (-Not (Test-Path "apps\web\.env.local")) {
    Copy-Item ".env.example" "apps\web\.env.local"
    Write-Host "Done - Created apps\web\.env.local" -ForegroundColor Green
} else {
    Write-Host "Skip - .env.local already exists" -ForegroundColor Gray
}
Write-Host ""

# 3. Python venv + deps
Write-Host "[3/4] Setting up Python STT service..." -ForegroundColor Yellow
Set-Location apps\stt

if (-Not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "Done - Python venv created" -ForegroundColor Green
}

.\venv\Scripts\activate
pip install -q -r requirements.txt
deactivate

Set-Location ..\..
Write-Host "Done - Python deps installed" -ForegroundColor Green
Write-Host ""

# 4. Ollama model
Write-Host "[4/4] Pulling Ollama model (llama3.2)..." -ForegroundColor Yellow
$ollamaList = ollama list
if ($ollamaList -match "llama3.2") {
    Write-Host "Skip - llama3.2 already pulled" -ForegroundColor Gray
} else {
    ollama pull llama3.2
    Write-Host "Done - Ollama model ready" -ForegroundColor Green
}
Write-Host ""

Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  Now run: npm run dev" -ForegroundColor White
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host ""