import "./SkeletonLoader.css";

export function SkeletonBlock({ width = "100%", height = "20px", radius = "8px", style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__header">
        <SkeletonBlock width="80px" height="12px" />
        <SkeletonBlock width="32px" height="32px" radius="8px" />
      </div>
      <SkeletonBlock width="120px" height="28px" style={{ marginBottom: "10px" }} />
      <SkeletonBlock width="90px" height="22px" radius="20px" />
    </div>
  );
}

export function ChartSkeleton({ height = "280px" }) {
  return (
    <div className="skeleton-chart" style={{ height }}>
      <SkeletonBlock width="140px" height="16px" style={{ marginBottom: "20px" }} />
      <SkeletonBlock width="100%" height={`calc(${height} - 56px)`} radius="12px" />
    </div>
  );
}
