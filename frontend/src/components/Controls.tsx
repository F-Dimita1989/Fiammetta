import { useState } from "react";
import { Minus, Plus, Power } from "lucide-react";

interface Props {
  currentTarget: number;
  mode: string;
}

export default function Controls({ currentTarget, mode }: Props) {
  const [temp, setTemp] = useState(currentTarget);
  const [sending, setSending] = useState(false);

  const handleSetTemp = async (newTemp: number) => {
    const clamped = Math.min(30, Math.max(10, newTemp));
    setTemp(clamped);
    setSending(true);
    try {
      await fetch(`/api/set_temp?target=${clamped}`, { method: "POST" });
    } catch (e) {
      console.error("Errore impostazione temperatura:", e);
    } finally {
      setSending(false);
    }
  };

  const isOff = mode === "off";

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5">
        Controlli
      </h3>

      <div className="flex flex-col gap-6">
        {/* Temperature Control */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Temperatura Target</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSetTemp(temp - 0.5)}
              disabled={sending}
              className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4 text-slate-300" />
            </button>
            <span className="text-2xl font-bold text-white w-20 text-center tabular-nums">
              {temp.toFixed(1)}°
            </span>
            <button
              onClick={() => handleSetTemp(temp + 0.5)}
              disabled={sending}
              className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min={10}
            max={30}
            step={0.5}
            value={temp}
            onChange={(e) => handleSetTemp(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>10°C</span>
            <span>20°C</span>
            <span>30°C</span>
          </div>
        </div>

        {/* Mode indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <span className="text-slate-400 text-sm">Modalita'</span>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isOff
                ? "bg-slate-700 text-slate-400"
                : "bg-emerald-900/40 text-emerald-400 border border-emerald-700/50"
            }`}
          >
            <Power className="w-4 h-4" />
            {isOff ? "OFF" : "HEAT"}
          </div>
        </div>
      </div>
    </div>
  );
}
