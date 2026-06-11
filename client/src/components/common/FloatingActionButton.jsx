import { motion } from 'framer-motion';

export default function FloatingActionButton({ label, icon, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow ${className}`}
      type="button"
    >
      {icon}
      {label}
    </motion.button>
  );
}
