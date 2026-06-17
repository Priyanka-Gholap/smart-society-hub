export default function StatusBadge({ label, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'border border-border-active bg-primary/12 text-primary shadow-glow',
    secondary: 'border border-secondary/20 bg-secondary/12 text-secondary',
    success: 'border border-secondary/24 bg-secondary/12 text-secondary',
    warning: 'border border-warning/24 bg-warning/12 text-warning',
    danger: 'border border-danger/28 bg-danger/12 text-danger',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-command ${variants[variant] || variants.primary} ${className}`}>
      {label}
    </span>
  );
}
