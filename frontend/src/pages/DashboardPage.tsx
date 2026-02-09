import { Link } from "react-router-dom";
import { Home, Flame, Activity, Wifi, WifiOff } from "lucide-react";
import { useBoilerState } from "../hooks/useBoilerState";
import StatusCards from "../components/StatusCards";
import TempChart from "../components/TempChart";
import PressureChart from "../components/PressureChart";
import Controls from "../components/Controls";
import ChatPanel from "../components/ChatPanel";

export default function DashboardPage() {
  const { state, error, connected } = useBoilerState(1000);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">
            {error || "Connessione al sistema..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-colors"
          >
            <Home className="w-4 h-4 text-slate-300" />
          </Link>
          <img
            src="/logo-trasparente.webp"
            alt="Fiammetta"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
              Fiammetta
            </h1>
            <p className="text-slate-500 text-xs">Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2 text-xs">
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 hidden sm:inline">
                  Connesso
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-400 hidden sm:inline">
                  Disconnesso
                </span>
              </>
            )}
          </div>

          {/* Heating badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
              state.heating_active
                ? "border-orange-500/50 bg-orange-950/30 text-orange-400"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                state.heating_active ? "animate-pulse" : ""
              }`}
            />
            {state.heating_active ? "ACCESO" : "SPENTO"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: cards + charts + controls */}
          <div className="lg:col-span-2 space-y-6">
            <StatusCards state={state} />

            <TempChart history={state.history} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PressureChart history={state.history} />
              <Controls
                currentTarget={state.target_temp}
                mode={state.mode}
              />
            </div>
          </div>

          {/* Right column: chat */}
          <div className="lg:col-span-1">
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
