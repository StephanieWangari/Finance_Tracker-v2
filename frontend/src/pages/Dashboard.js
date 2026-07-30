import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import MetricCard from "../components/ui/MetricCard";
import { MetricCardSkeleton } from "../components/ui/SkeletonLoader";
import { EmptyState, ErrorAlert } from "../components/ui/Feedback";
import "./Dashboard.css";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ amount: "", type: "expense", category: "General" });
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = ["General", "Food", "Transport", "Housing", "Health", "Entertainment", "Savings", "Other"];

  const fetchTransactions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to load transactions. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    try {
      setSubmitting(true);
      await api.post("/transactions", { ...form, amount: parseFloat(form.amount) });
      setForm({ amount: "", type: "expense", category: "General" });
      await fetchTransactions();
    } catch {
      setError("Failed to add transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netWorth = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard__page-header">
        <div>
          <h1 className="dashboard__title">Overview</h1>
          <p className="dashboard__subtitle">Your financial summary at a glance</p>
        </div>
        <button className="dashboard__add-btn" onClick={() => document.getElementById("add-form").scrollIntoView({ behavior: "smooth" })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Transaction
        </button>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchTransactions} />}

      {/* Metric Cards */}
      <div className="dashboard__metrics">
        {loading ? (
          Array(4).fill(0).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard title="Net Worth" value={fmt(netWorth)} accent={netWorth >= 0 ? "emerald" : "rose"}
              trend={savingsRate} trendLabel="savings rate"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
            <MetricCard title="Total Income" value={fmt(totalIncome)} accent="emerald"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
            />
            <MetricCard title="Total Expenses" value={fmt(totalExpenses)} accent="rose"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
            />
            <MetricCard title="Transactions" value={transactions.length} accent="indigo"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            />
          </>
        )}
      </div>

      <div className="dashboard__grid">
        {/* Add Transaction Form */}
        <div className="dashboard__form-card" id="add-form">
          <h3 className="dashboard__section-title">New Transaction</h3>
          <form onSubmit={handleAdd} className="dashboard__form">
            <div className="dashboard__form-group">
              <label className="dashboard__label">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="dashboard__form-row">
              <div className="dashboard__form-group">
                <label className="dashboard__label">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="dashboard__form-group">
                <label className="dashboard__label">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="dashboard__submit-btn" disabled={submitting}>
              {submitting ? "Adding..." : "Add Transaction"}
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard__transactions-card">
          <h3 className="dashboard__section-title">Recent Transactions</h3>
          {loading ? (
            <div className="dashboard__tx-list">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="dashboard__tx-skeleton">
                  <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: "100px", height: "12px", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ width: "60px", height: "10px" }} />
                  </div>
                  <div className="skeleton" style={{ width: "60px", height: "14px" }} />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState title="No transactions" message="Add your first income or expense to begin tracking." />
          ) : (
            <div className="dashboard__tx-list">
              {[...transactions].reverse().slice(0, 10).map((t, i) => (
                <div key={i} className="dashboard__tx-item">
                  <div className={`dashboard__tx-icon dashboard__tx-icon--${t.type}`}>
                    {t.type === "income"
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>}
                  </div>
                  <div className="dashboard__tx-info">
                    <span className="dashboard__tx-category">{t.category || "General"}</span>
                    <span className="dashboard__tx-date">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <span className={`dashboard__tx-amount dashboard__tx-amount--${t.type}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
