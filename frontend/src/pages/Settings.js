import { useState } from "react";
import "./Settings.css";

const DEFAULT_CATEGORIES = ["General", "Food", "Transport", "Housing", "Health", "Entertainment", "Savings", "Other"];

export default function Settings() {
  const [budgetLimit, setBudgetLimit] = useState(() => localStorage.getItem("budgetLimit") || "3000");
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "USD");
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("categories")) || DEFAULT_CATEGORIES; }
    catch { return DEFAULT_CATEGORIES; }
  });
  const [newCategory, setNewCategory] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("budgetLimit", budgetLimit);
    localStorage.setItem("currency", currency);
    localStorage.setItem("categories", JSON.stringify(categories));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    if (DEFAULT_CATEGORIES.includes(cat)) return;
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Settings</h1>
        <p className="settings__subtitle">Manage your budget parameters and preferences</p>
      </div>

      <div className="settings__grid">
        {/* Budget Parameters */}
        <div className="settings__card">
          <div className="settings__card-header">
            <div className="settings__card-icon settings__card-icon--indigo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <h3 className="settings__card-title">Budget Parameters</h3>
              <p className="settings__card-desc">Set your monthly spending limits</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="settings__form">
            <div className="settings__field">
              <label className="settings__label">Monthly Budget Cap</label>
              <div className="settings__input-prefix">
                <span className="settings__prefix">$</span>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  min="0"
                  step="100"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
              <p className="settings__hint">This limit is used in the burn rate chart on Analytics.</p>
            </div>
            <div className="settings__field">
              <label className="settings__label">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="ZAR">ZAR — South African Rand</option>
              </select>
            </div>
            <button type="submit" className={`settings__save-btn${saved ? " settings__save-btn--saved" : ""}`}>
              {saved ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Saved!
                </>
              ) : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Category Management */}
        <div className="settings__card">
          <div className="settings__card-header">
            <div className="settings__card-icon settings__card-icon--emerald">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div>
              <h3 className="settings__card-title">Categories</h3>
              <p className="settings__card-desc">Manage your transaction categories</p>
            </div>
          </div>

          <div className="settings__category-add">
            <input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            />
            <button type="button" className="settings__add-cat-btn" onClick={addCategory}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
          </div>

          <div className="settings__categories">
            {categories.map((cat) => (
              <div key={cat} className="settings__category-tag">
                <span>{cat}</span>
                {!DEFAULT_CATEGORIES.includes(cat) && (
                  <button className="settings__cat-remove" onClick={() => removeCategory(cat)} aria-label={`Remove ${cat}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="settings__hint" style={{ marginTop: "12px" }}>Default categories cannot be removed.</p>
        </div>
      </div>
    </div>
  );
}
