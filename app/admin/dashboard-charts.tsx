"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardCharts({ chartData }: { chartData: { date: string; count: number }[] }) {
  return (
    <div className="card-dark p-6">
      <h2 className="font-display text-xl mb-6" style={{ color: "#C9A84C" }}>DAILY TICKET SALES</h2>
      {chartData.length === 0 ? (
        <p className="text-sm font-body text-center py-8" style={{ color: "#9A8F78" }}>No sales data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
            <XAxis dataKey="date" tick={{ fill: "#9A8F78", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9A8F78", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, color: "#F5F0E8" }} />
            <Line type="monotone" dataKey="count" stroke="#C9A84C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
