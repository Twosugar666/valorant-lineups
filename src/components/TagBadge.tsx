export function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-val-border bg-val-elevated px-2 py-0.5 text-xs text-val-muted">
      {children}
    </span>
  );
}
