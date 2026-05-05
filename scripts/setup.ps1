Write-Host ""
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "  Voice Diary - Setup" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host ""

npm install

if (-Not (Test-Path "apps\web\.env.local")) {
    Copy-Item ".env.example" "apps\web\.env.local"
}

Set-Location apps\stt

if (-Not (Test-Path "venv")) {
    python -m venv venv
}

.\venv\Scripts\activate
pip install -q -r requirements.txt
deactivate

Set-Location ..\..

$ollamaList = ollama list
if (-Not ($ollamaList -match "llama3.2")) {
    ollama pull llama3.2
}

Write-Host ""
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  Now run: npm run dev" -ForegroundColor White
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host ""