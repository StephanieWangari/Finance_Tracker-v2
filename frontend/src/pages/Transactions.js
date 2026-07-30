import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { EmptyState, ErrorAlert } from "../components/ui/Feedback";
import { SkeletonBlock } from "../components/ui/SkeletonLoader";
import "./Transactions.css";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = transactions
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .filter((t) => !search || (t.category || "").toLowerCase().includes(search.toLowerCase()))
    .reverse();

  return (
    <div className="transactions">
      <div className="transactions__header">
        <div>
          <h1 className="transactions__title">Transactions</h1>
          <p className="transactions__subtitle">{transactions.length} total records</p>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchData} />}

      <div className="transactions__toolbar">
        <div className="transactions__search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by category..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="transactions__type-filters">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              className={`transactions__type-btn transactions__type-btn--${t}${typeFilter === t ? " active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="transactions__table-card">
        <div className="transactions__table-head">
          <span>Category</span>
          <span>Type</span>
          <span>Date</span>
          <span>Amount</span>
        </div>

        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="transactions__table-row transactions__table-row--skeleton">
              <SkeletonBlock width="100px" height="13px" />
              <SkeletonBlock width="60px" height="22px" radius="20px" />
              <SkeletonBlock width="80px" height="13px" />
              <SkeletonBlock width="70px" height="13px" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <EmptyState title="No transactions found" message="Try adjusting your filters." />
        ) : (
          filtered.map((t, i) => (
            <div key={i} className="transactions__table-row">
              <div className="transactions__row-category">
                <div className={`transactions__row-icon transactions__row-icon--${t.type}`}>
                  {t.type === "income"
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>}
                </div>
                <span>{t.category || "General"}</span>
              </div>
              <span className={`transactions__badge transactions__badge--${t.type}`}>
                {t.type}
              </span>
              <span className="transactions__date">
                {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className={`transactions__amount transactions__amount--${t.type}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
