import "./MetricCard.css";

const currency= localStorage.getItem("currency") || "USD";

let prefix = ""

if (currency == "USD") {
  prefix = 'KES'
}

export default function MetricCard({ title, value, trend, trendLabel, icon, accent = "indigo" }) {
  const isPositive = trend >= 0;

  return (
    <div className={`metric-card metric-card--${accent}`}>
      <div className="metric-card__header">
        <span className="metric-card__title">{title}</span>
        <div className={`metric-card__icon metric-card__icon--${accent}`}>{icon}</div>
      </div>
      <div className="metric-card__value">{value}</div>
      {trend !== undefined && (
        <div className={`metric-card__trend ${isPositive ? "metric-card__trend--up" : "metric-card__trend--down"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isPositive
              ? <polyline points="18 15 12 9 6 15"/>
              : <polyline points="6 9 12 15 18 9"/>}
          </svg>
          <span>{Math.abs(trend)}% {trendLabel || "vs last month"}</span>
        </div>
      )}
    </div>
  );
}
