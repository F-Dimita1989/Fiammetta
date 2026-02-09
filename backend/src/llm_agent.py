import requests

from src.rag_engine import RagEngine

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.2:1b"

SYSTEM_PROMPT = (
    "Sei Fiammetta, assistente AI esperta di caldaie, impianti di riscaldamento "
    "e sistemi OpenTherm. Rispondi sempre in italiano, in modo conciso e utile. "
    "Se ti vengono forniti dati sullo stato del sistema, usali per dare consigli pertinenti."
)


class HomeAssistantAgent:
    def __init__(self):
        try:
            self.rag = RagEngine()
        except Exception:
            self.rag = None

        # Warm up Ollama (pre-load model into memory)
        self._ready = False
        try:
            r = requests.post(
                OLLAMA_URL,
                json={
                    "model": MODEL,
                    "messages": [{"role": "user", "content": "ciao"}],
                    "stream": False,
                    "options": {"num_predict": 1},
                },
                timeout=60,
            )
            self._ready = r.status_code == 200
            print(f"[AI] Fiammetta ({'OK' if self._ready else 'FAILED'}) via Ollama ({MODEL})")
        except Exception as e:
            print(f"[AI] Ollama not reachable: {e}")

    def process_query(self, input_text: str):
        if not self._ready:
            yield ("error", "Fiammetta non disponibile. Ollama non raggiungibile.")
            return

        user_question = (
            input_text.split("USER QUESTION:")[-1].strip()
            if "USER QUESTION:" in input_text
            else input_text
        )

        # Build context from RAG if available
        rag_context = ""
        if self.rag:
            try:
                docs = self.rag.search(user_question, limit=2)
                rag_context = "\n".join(docs)
            except Exception:
                pass

        user_msg = input_text
        if rag_context:
            user_msg = f"Contesto:\n{rag_context}\n\n{input_text}"

        try:
            resp = requests.post(
                OLLAMA_URL,
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_msg},
                    ],
                    "stream": True,
                    "options": {"num_predict": 256},
                },
                stream=True,
                timeout=120,
            )

            for line in resp.iter_lines():
                if line:
                    import json
                    data = json.loads(line)
                    content = data.get("message", {}).get("content", "")
                    if content:
                        yield ("chunk", content)
                    if data.get("done", False):
                        break

        except Exception as e:
            yield ("error", str(e))

    def close(self):
        if self.rag:
            self.rag.close()
