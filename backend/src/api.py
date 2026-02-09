import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
import uvicorn

from src.system_controller import SystemController
from src.llm_agent import HomeAssistantAgent


# Use lifespan context manager for startup/shutdown events (Modern FastAPI)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("--- Starting System Controller ---")
    system.start()
    print("--- Loading AI Agent ---")
    # Doing agent init here might block event loop if not careful,
    # but LlamaCpp loading is heavy anyway.
    global agent
    agent = HomeAssistantAgent()
    yield
    # Shutdown
    print("--- Shutting Down ---")
    system.stop()
    if agent:
        agent.close()


app = FastAPI(title="Home Assistant AI API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
system = SystemController()
agent = None


class ChatRequest(BaseModel):
    message: str


@app.get("/api/state")
async def get_state():
    """Returns the full state of the boiler system including chart history"""
    return system.state


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    """
    Streams the AI response.
    Yields chunks of text.
    """

    async def event_generator():
        # Clean inputs
        safe_msg = req.message.strip()
        if not safe_msg:
            return

        # Inject context
        status_context = (
            f"CURRENT SYSTEM STATUS:\n"
            f"Temp: {system.state['room_temp']:.1f}°C\n"
            f"Target: {system.state['target_temp']:.1f}°C\n"
            f"Pressure: {system.state['boiler_pressure']:.2f} bar\n"
            f"Heating: {system.state['heating_active']}\n"
        )

        full_prompt = f"{status_context}\nUSER QUESTION: {safe_msg}"

        # Generator from agent
        if agent:
            for event_type, data in agent.process_query(full_prompt):
                if event_type == "chunk":
                    yield data
                elif event_type == "error":
                    yield f"\n[System Error: {data}]"
        else:
            yield "AI Agent not initialized yet."

    return StreamingResponse(event_generator(), media_type="text/plain")


@app.post("/api/set_temp")
async def set_temp(target: float):
    system.state["target_temp"] = target
    return {"status": "ok", "target": target}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
