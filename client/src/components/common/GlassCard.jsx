import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`command-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
