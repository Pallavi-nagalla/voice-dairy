# Check if ollama is already running
$connection = Test-NetConnection -ComputerName localhost -Port 11434 -WarningAction SilentlyContinue

if ($connection.TcpTestSucceeded) {
    Write-Host "[ollama] Already running on port 11434 - skipping" -ForegroundColor Gray
    # Keep process alive so concurrently doesn't exit
    while ($true) { Start-Sleep -Seconds 60 }
} else {
    Write-Host "[ollama] Starting ollama serve..." -ForegroundColor Cyan
    ollama serve
}