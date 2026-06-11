export default function StatusBadge({ label, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-white/10 text-white border border-white/10',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${variants[variant] || variants.primary} ${className}`}>
      {label}
    </span>
  );
}
