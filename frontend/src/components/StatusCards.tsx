import { Thermometer, Crosshair, Gauge, Flame } from "lucide-react";
import type { BoilerState } from "../types/boiler";

interface Props {
  state: BoilerState;
}

export default function StatusCards({ state }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Room Temperature */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6 flex flex-col items-center gap-2">
        <Thermometer className="w-7 h-7 text-blue-400" />
        <span className="text-4xl font-bold tracking-tight text-white">
          {state.room_temp.toFixed(1)}°
        </span>
        <span className="text-sm text-slate-400">Temperatura Ambiente</span>
      </div>

      {/* Target Temperature */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6 flex flex-col items-center gap-2">
        <Crosshair className="w-7 h-7 text-emerald-400" />
        <span className="text-4xl font-bold tracking-tight text-white">
          {state.target_temp.toFixed(1)}°
        </span>
        <span className="text-sm text-slate-400">Temperatura Target</span>
      </div>

      {/* Pressure */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6 flex flex-col items-center gap-2">
        <Gauge
          className={`w-7 h-7 ${
            state.boiler_pressure < 1.0 ? "text-red-400" : "text-violet-400"
          }`}
        />
        <span className="text-4xl font-bold tracking-tight text-white">
          {state.boiler_pressure.toFixed(2)}
        </span>
        <span className="text-sm text-slate-400">Pressione (Bar)</span>
      </div>

      {/* Heating Status */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col items-center gap-2 backdrop-blur-sm ${
          state.heating_active
            ? "border-orange-500/50 bg-orange-950/30"
            : "border-slate-700/50 bg-slate-800/50"
        }`}
      >
        <Flame
          className={`w-7 h-7 ${
            state.heating_active
              ? "text-orange-400 animate-pulse"
              : "text-slate-500"
          }`}
        />
        <span
          className={`text-2xl font-bold tracking-tight ${
            state.heating_active ? "text-orange-400" : "text-slate-400"
          }`}
        >
          {state.heating_active ? "ACCESO" : "SPENTO"}
        </span>
        <span className="text-sm text-slate-400">Riscaldamento</span>
      </div>
    </div>
  );
}
