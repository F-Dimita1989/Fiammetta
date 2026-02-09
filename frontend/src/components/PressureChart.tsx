import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistoryEntry } from "../types/boiler";

interface Props {
  history: HistoryEntry[];
}

export default function PressureChart({ history }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Pressione Caldaia
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              domain={[0, "auto"]}
              unit=" bar"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                fontSize: "0.85rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="pressure"
              name="Pressione"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#pressureGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
