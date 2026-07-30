import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import BurnRateChart from "../components/charts/BurnRateChart";
import DonutChart from "../components/charts/DonutChart";
import IncomeExpenseBar from "../components/charts/IncomeExpenseBar";
import { ChartSkeleton } from "../components/ui/SkeletonLoader";
import { EmptyState, ErrorAlert } from "../components/ui/Feedback";
import "./Analytics.css";

const FILTERS = ["All Time", "This Month", "Last 3 Months", "Last 6 Months", "This Year"];

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Last 6 Months");

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = applyFilter(transactions, filter);
  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="analytics">
      <div className="analytics__header">
        <div>
          <h1 className="analytics__title">Analytics & Trends</h1>
          <p className="analytics__subtitle">Visual breakdown of your financial activity</p>
        </div>
        <div className="analytics__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`analytics__filter-btn${filter === f ? " analytics__filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchData} />}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="No data for this period"
          message="Try selecting a different date range or add some transactions."
        />
      ) : (
        <>
          <div className="analytics__summary">
            <div className="analytics__summary-item analytics__summary-item--income">
              <span className="analytics__summary-label">Total Income</span>
              <span className="analytics__summary-value">${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="analytics__summary-divider" />
            <div className="analytics__summary-item analytics__summary-item--expense">
              <span className="analytics__summary-label">Total Expenses</span>
              <span className="analytics__summary-value">${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="analytics__summary-divider" />
            <div className={`analytics__summary-item analytics__summary-item--${totalIncome - totalExpenses >= 0 ? "income" : "expense"}`}>
              <span className="analytics__summary-label">Net Balance</span>
              <span className="analytics__summary-value">${(totalIncome - totalExpenses).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="analytics__charts-grid">
            {loading ? (
              <>
                <ChartSkeleton height="320px" />
                <ChartSkeleton height="320px" />
                <ChartSkeleton height="320px" />
              </>
            ) : (
              <>
                <div className="analytics__chart-full">
                  <BurnRateChart transactions={filtered} />
                </div>
                <DonutChart transactions={filtered} />
                <IncomeExpenseBar transactions={filtered} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function applyFilter(transactions, filter) {
  const now = new Date();
  return transactions.filter((t) => {
    const d = new Date(t.date);
    if (filter === "This Month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (filter === "Last 3 Months") return d >= new Date(now.getFullYear(), now.getMonth() - 3, 1);
    if (filter === "Last 6 Months") return d >= new Date(now.getFullYear(), now.getMonth() - 6, 1);
    if (filter === "This Year") return d.getFullYear() === now.getFullYear();
    return true;
  });
}
