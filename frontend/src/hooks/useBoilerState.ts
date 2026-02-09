import { useState, useEffect, useRef } from "react";
import type { BoilerState } from "../types/boiler";

export function useBoilerState(intervalMs = 1000) {
  const [state, setState] = useState<BoilerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const retryRef = useRef(0);

  useEffect(() => {
    let active = true;

    const fetchState = async () => {
      try {
        const res = await fetch("/api/state");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BoilerState = await res.json();
        if (active) {
          setState(data);
          setConnected(true);
          setError(null);
          retryRef.current = 0;
        }
      } catch (e) {
        if (active) {
          setConnected(false);
          retryRef.current++;
          setError(
            retryRef.current > 3
              ? "Backend non raggiungibile. Assicurati che il server sia avviato."
              : "Connessione in corso..."
          );
        }
      }
    };

    fetchState();
    const id = setInterval(fetchState, intervalMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { state, error, connected };
}
