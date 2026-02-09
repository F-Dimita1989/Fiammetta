import { Link } from "react-router-dom";
import {
  Flame,
  Thermometer,
  Gauge,
  ArrowRight,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useBoilerState } from "../hooks/useBoilerState";

export default function HomePage() {
  const { state, connected } = useBoilerState(2000);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src="/logo-trasparente.webp"
            alt="Fiammetta logo"
            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
              Fiammetta
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              La tua caldaia intelligente
            </p>
          </div>
        </div>

        <p className="text-slate-400 text-center max-w-lg mb-10 leading-relaxed">
          Monitora e controlla la tua caldaia in tempo reale. Visualizza
          temperature, pressione e stato del riscaldamento. Chiedi consigli
          a Fiammetta, la tua assistente AI.
        </p>

        {/* Quick Status Cards */}
        {state && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-2xl">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 flex items-center gap-4">
              <Thermometer className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {state.room_temp.toFixed(1)}°C
                </p>
                <p className="text-xs text-slate-400">Temperatura</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 flex items-center gap-4">
              <Gauge className="w-8 h-8 text-violet-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {state.boiler_pressure.toFixed(2)} bar
                </p>
                <p className="text-xs text-slate-400">Pressione</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 flex items-center gap-4">
              <Flame
                className={`w-8 h-8 shrink-0 ${
                  state.heating_active ? "text-orange-400" : "text-slate-500"
                }`}
              />
              <div>
                <p
                  className={`text-2xl font-bold ${
                    state.heating_active ? "text-orange-400" : "text-slate-400"
                  }`}
                >
                  {state.heating_active ? "ON" : "OFF"}
                </p>
                <p className="text-xs text-slate-400">Riscaldamento</p>
              </div>
            </div>
          </div>
        )}

        {!state && (
          <div className="flex items-center gap-2 text-slate-500 mb-10">
            <Activity className="w-4 h-4 animate-spin" />
            <span className="text-sm">Connessione al backend...</span>
          </div>
        )}

        {/* CTA */}
        <Link
          to="/dashboard"
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-lg transition-all shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50"
        >
          Vai alla Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
        <span>Fiammetta v1.0</span>
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Connesso</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400">Disconnesso</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
