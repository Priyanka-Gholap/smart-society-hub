import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message, variant = 'info', visible = false }) {
  const styleMap = {
    info: 'border-primary/30 text-text-strong',
    success: 'border-secondary/30 text-secondary',
    warning: 'border-warning/30 text-warning',
    danger: 'border-danger/30 text-danger',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.25 }}
          className={`toast-card fixed bottom-6 right-6 z-50 max-w-sm ${styleMap[variant] || styleMap.info}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
