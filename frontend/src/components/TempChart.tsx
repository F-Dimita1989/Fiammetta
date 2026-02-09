import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HistoryEntry } from "../types/boiler";

interface Props {
  history: HistoryEntry[];
}

export default function TempChart({ history }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Andamento Temperature
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
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
              domain={["auto", "auto"]}
              unit="°C"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                fontSize: "0.85rem",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "0.8rem", color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              name="Ambiente"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="stepAfter"
              dataKey="target"
              name="Target"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
