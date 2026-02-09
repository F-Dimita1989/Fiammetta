# Scarica il modello Llama 3.2 3B Instruct GGUF
# Wrapper per lo script Python che gestisce correttamente la modalità online/offline

Write-Host "Avvio script di download Python (fix offline mode)..." -ForegroundColor Green

python scripts/dl_model.py

if ($?) {
    Write-Host "Procedura completata." -ForegroundColor Green
} else {
    Write-Host "Qualcosa è andato storto." -ForegroundColor Red
}
