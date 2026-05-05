$connection = Test-NetConnection -ComputerName localhost -Port 11434 -WarningAction SilentlyContinue

if ($connection.TcpTestSucceeded) {
    while ($true) { Start-Sleep -Seconds 60 }
} else {
    ollama serve
}