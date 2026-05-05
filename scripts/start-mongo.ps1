$mongoPaths = @(
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
)

$mongod = $null
foreach ($path in $mongoPaths) {
    if (Test-Path $path) {
        $mongod = $path
        break
    }
}

if (-Not $mongod) {
    Write-Host "[mongo] mongod.exe not found. Install MongoDB Community first." -ForegroundColor Red
    exit 1
}

$dbPath = (Resolve-Path "$PSScriptRoot\..").Path + "\data\db"

if (-Not (Test-Path $dbPath)) {
    New-Item -ItemType Directory -Path $dbPath -Force | Out-Null
}

& $mongod --dbpath $dbPath --quiet