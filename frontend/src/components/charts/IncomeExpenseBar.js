import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./ChartCard.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="chart-tooltip__item">
          {p.name}: <strong>${p.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

export default function IncomeExpenseBar({ transactions }) {
  const data = buildMonthlyComparison(transactions);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Income vs Expenses</h3>
          <p className="chart-card__subtitle">Monthly revenue against outgoing costs</p>
        </div>
        <div className="chart-card__badge chart-card__badge--amber">6 Months</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }} />
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildMonthlyComparison(transactions) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = months[d.getMonth()];
    if (!map[key]) map[key] = { month: key, Income: 0, Expenses: 0 };
    if (t.type === "income") map[key].Income += t.amount;
    else map[key].Expenses += t.amount;
  });
  return Object.values(map).slice(-6);
}
