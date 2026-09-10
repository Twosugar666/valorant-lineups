export function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-val-border/90 bg-val-elevated/80 px-2 py-0.5 text-xs text-val-muted">
      {children}
    </span>
  );
}
