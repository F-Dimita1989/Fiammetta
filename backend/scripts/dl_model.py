import os

# FORZA L'ONLINE MODE
# Sembra che il sistema abbia HF_HUB_OFFLINE impostato. Lo disabilitiamo.
if "HF_HUB_OFFLINE" in os.environ:
    print("Rilevata modalità Offline. Disabilitazione temporanea...")
    del os.environ["HF_HUB_OFFLINE"]
os.environ["HF_HUB_OFFLINE"] = "0"

from huggingface_hub import hf_hub_download, list_repo_files

# Lista dei modelli da scaricare (Repo, Filename)
models_to_download = [
    (
        "bartowski/Llama-3.2-3B-Instruct-GGUF",
        "Llama-3.2-3B-Instruct-Q4_K_M.gguf",
    ),  # Expert
    (
        "bartowski/Llama-3.2-1B-Instruct-GGUF",
        "Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    ),  # Router
]
local_dir = "models"

print(f"Tentativo con Bartowski (Online Mode Forzata)...")

try:
    print("Verifica connessione e lista file...")

    for repo_id, filename in models_to_download:
        print(f"\n--- Controllo {filename} su {repo_id} ---")
        try:
            files_repo = list_repo_files(repo_id)
            if filename in files_repo:
                print(f"Trovato! Inizio download...")
                path = hf_hub_download(
                    repo_id=repo_id,
                    filename=filename,
                    local_dir=local_dir,
                    local_dir_use_symlinks=False,
                    force_download=False,
                    resume_download=True,
                )
                print(f"✅ Scaricato: {path}")
            else:
                print(f"❌ File non trovato nel repo: {filename}")
        except Exception as e:
            print(f"Errore su {repo_id}: {e}")

except Exception as e:
    print(f"\nERRORE: {e}")
