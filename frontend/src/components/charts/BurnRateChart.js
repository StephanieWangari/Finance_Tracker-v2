import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from "recharts";
import "./ChartCard.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="chart-tooltip__item">
          {p.name}: <strong>${p.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

export default function BurnRateChart({ transactions, budgetLimit = 3000 }) {
  const monthlyData = buildMonthlyData(transactions, budgetLimit);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Budget Burn Rate</h3>
          <p className="chart-card__subtitle">Cumulative spending vs. budget ceiling</p>
        </div>
        <div className="chart-card__badge chart-card__badge--indigo">MTD</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }} />
          <ReferenceLine y={budgetLimit} stroke="#f43f5e" strokeDasharray="6 3" label={{ value: "Limit", fill: "#f43f5e", fontSize: 11 }} />
          <Line type="monotone" dataKey="Spending" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildMonthlyData(transactions, budgetLimit) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = months[d.getMonth()];
    if (!map[key]) map[key] = { month: key, Spending: 0, Income: 0 };
    if (t.type === "expense") map[key].Spending += t.amount;
    else map[key].Income += t.amount;
  });
  return Object.values(map).slice(-6);
}
