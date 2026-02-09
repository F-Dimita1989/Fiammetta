# Fiammetta - Caldaia Intelligente

Dashboard web per il monitoraggio e controllo di una caldaia simulata con assistente AI integrato.

## Architettura

```
Fiammetta/
  frontend/     React + TypeScript + Tailwind CSS (Vite)
  backend/      FastAPI + Simulatore OpenTherm + AI (Ollama/Llama 3.2)
```

- **Frontend**: homepage, dashboard real-time con grafici, controlli temperatura, chat AI
- **Backend**: simulatore caldaia OpenTherm (TCP), controller di sistema, API REST, agente AI (Fiammetta)

## Requisiti

- **Node.js** >= 18
- **Python** >= 3.10
- **Ollama** (per l'AI) - [ollama.com](https://ollama.com)

## Installazione

### 1. Clona il repository

```bash
git clone https://github.com/F-Dimita1989/Fiammetta.git
cd Fiammetta
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Scarica il modello AI con Ollama:

```bash
ollama pull llama3.2:1b
```

### 3. Frontend

```bash
cd frontend
npm install
```

## Avvio

### Avvio manuale (3 terminali)

**Terminale 1** - Simulatore caldaia:
```bash
cd backend
python src/opentherm_boiler_sim.py
```

**Terminale 2** - API Backend:
```bash
cd backend
set PYTHONPATH=.
python -m uvicorn src.api:app --host 0.0.0.0 --port 8000
```

**Terminale 3** - Frontend:
```bash
cd frontend
npm run dev
```

### Avvio rapido (Windows)

```bash
start.bat
```

Apri il browser su **http://localhost:5173**

## Funzionalita

- Monitoraggio temperatura ambiente e target in tempo reale
- Grafico storico temperature e pressione (Recharts)
- Controllo temperatura target con slider
- Indicatore stato riscaldamento (acceso/spento)
- Chat AI con Fiammetta (Llama 3.2 via Ollama, streaming)
- Design mobile-first, accessibile da rete locale

## Stack Tecnologico

| Componente | Tecnologia |
|-----------|------------|
| Frontend  | React 19, TypeScript, Tailwind CSS 4, Vite 7, Recharts |
| Backend   | FastAPI, Uvicorn, Python 3.12 |
| Simulatore| OpenTherm TCP server custom |
| AI        | Ollama, Llama 3.2 1B, LangChain (RAG opzionale) |
| Protocollo| MQTT (opzionale, Home Assistant) |
