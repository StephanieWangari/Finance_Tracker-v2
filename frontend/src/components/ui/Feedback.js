import "./Feedback.css";

export function EmptyState({ title = "No data yet", message = "Add your first transaction to get started.", action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && (
        <button className="empty-state__action" onClick={action}>{actionLabel || "Get Started"}</button>
      )}
    </div>
  );
}

export function ErrorAlert({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="error-alert">
      <div className="error-alert__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="error-alert__body">
        <p className="error-alert__message">{message}</p>
        {onRetry && (
          <button className="error-alert__retry" onClick={onRetry}>Retry</button>
        )}
      </div>
    </div>
  );
}
