import { motion } from 'framer-motion';

export default function FloatingActionButton({ label, icon, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`btn-primary fixed bottom-6 right-6 z-50 gap-2 rounded-full px-5 ${className}`}
      type="button"
    >
      {icon}
      {label}
    </motion.button>
  );
}
