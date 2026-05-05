$env:HF_HUB_DISABLE_SYMLINKS_WARNING = "1"
Set-Location apps\stt
.\venv\Scripts\activate
uvicorn main:app --port 8000 --log-level warning