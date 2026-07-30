import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

const ROUTE_LABELS = {
  "/dashboard": ["Overview"],
  "/analytics": ["Analytics"],
  "/transactions": ["Transactions"],
  "/settings": ["Settings"],
};

export default function Header({ user }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const crumbs = ROUTE_LABELS[location.pathname] || ["Page"];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="app-header">
      <div className="app-header__breadcrumb">
        <span className="app-header__crumb-root">FinanceTracker</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="app-header__crumb-current">{crumbs[0]}</span>
      </div>

      <div className="app-header__search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search transactions..." className="app-header__search-input" />
      </div>

      <div className="app-header__actions">
        <button className="app-header__icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="app-header__badge" />
        </button>

        <div className="app-header__profile" ref={dropdownRef}>
          <button
            className="app-header__avatar"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-label="Profile menu"
          >
            <span>{initials}</span>
          </button>

          {dropdownOpen && (
            <div className="app-header__dropdown">
              <div className="app-header__dropdown-user">
                <div className="app-header__dropdown-avatar">{initials}</div>
                <div>
                  <p className="app-header__dropdown-name">{user?.name || "User"}</p>
                  <p className="app-header__dropdown-email">{user?.email || ""}</p>
                </div>
              </div>
              <div className="app-header__dropdown-divider" />
              <button className="app-header__dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </button>
              <button className="app-header__dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/></svg>
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
