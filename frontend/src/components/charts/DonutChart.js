import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./ChartCard.css";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#8b5cf6"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }} className="chart-tooltip__item">
        ${payload[0].value?.toLocaleString()} — <strong>{payload[0].payload.percent}%</strong>
      </p>
    </div>
  );
};

export default function DonutChart({ transactions }) {
  const data = buildCategoryData(transactions);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Spending Allocation</h3>
          <p className="chart-card__subtitle">Category breakdown by percentage</p>
        </div>
        <div className="chart-card__badge chart-card__badge--emerald">Expenses</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildCategoryData(transactions) {
  const map = {};
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  expenses.forEach((t) => {
    const cat = t.category || "General";
    map[cat] = (map[cat] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    percent: total ? Math.round((value / total) * 100) : 0,
  }));
}
