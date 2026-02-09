# 🧠 Home Assistant AI - Intelligent Boiler Controller

Questo progetto trasforma una caldaia standard OpenTherm in un sistema intelligente integrato con Home Assistant, potenziato da modelli AI locali (Llama 3.2).

## 🌟 Caratteristiche

- **Loop di Controllo Fisico**: Simula la termodinamica della stanza e comunica con la caldaia via socket.
- **AI Consultant**: Un'intelligenza artificiale (Llama 3.2 3B) monitora costantemente lo stato (Pressione, Temperatura) e fornisce consulenza via chat o avvisi proattivi.
- **RAG (Retrieval Augmented Generation)**: L'AI ha accesso ai manuali tecnici della caldaia tramite un database vettoriale (Qdrant) per rispondere a domande specifiche.
- **Web Dashboard**: Interfaccia moderna in Next.js con grafici in tempo reale e chat integrata.
- **Integrazione Home Assistant**: Supporta l'auto-discovery MQTT per il controllo nativo da HA.

## 🚀 Installazione & Avvio

1.  **Prerequisiti**: Docker (per Home Assistant/Mosquitto), Python 3.10+, Node.js.
2.  **Setup Iniziale**:
    Esegui lo script principale:

    ```powershell
    .\start.bat
    ```

3.  **Accesso**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **API**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🏠 Home Assistant Integration

Il sistema pubblica automaticamente entità MQTT su `homeassistant/climate/boiler_ai`.
Assicurati che il tuo broker MQTT sia attivo e Home Assistant configurato.

```yaml
# Esempio Dashboard Card
type: thermostat
entity: climate.ai_smart_thermostat
```

## 📂 Struttura Progetto

- `src/api.py`: Backend FastAPI.
- `src/system_controller.py`: Controllo PID/Hysteresis e MQTT.
- `src/llm_agent.py`: Gestore AI e RAG.
- `web-interface/`: Frontend Next.js.
- `knowledge/`: Manuali per l'AI.

---

_Progetto sviluppato da Antigravity AI_
