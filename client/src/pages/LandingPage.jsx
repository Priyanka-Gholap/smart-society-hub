import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

const pulseVariants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-slate-100 overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], x: [20, -20, 20] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          <motion.div className="space-y-8" variants={containerVariants}>
            <motion.span
              variants={itemVariants}
              className="inline-flex rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/20 backdrop-blur-sm hover:bg-cyan-500/30 transition"
            >
              Disaster-Ready Communities powered by AI
            </motion.span>
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.h1
                variants={itemVariants}
                className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl leading-tight"
              >
                Smart Society Hub: Disaster-Ready Community{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Command Center
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="max-w-2xl text-lg leading-8 text-slate-300"
              >
                Manage society operations, emergency alerts, volunteers, shelters, and live safety status with premium SaaS-grade dashboards built for modern residential communities.
              </motion.p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition hover:shadow-xl hover:shadow-cyan-500/60"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-3 text-base font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-900/60 backdrop-blur-sm"
                >
                  Explore Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="relative overflow-hidden rounded-[2rem] bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/20 ring-1 ring-white/10 border border-cyan-500/20 backdrop-blur-xl"
          >
            {/* Card glow effect */}
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0"
            />
            
            <div className="relative space-y-6 z-10">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-950/80 to-slate-900/40 p-6 shadow-inner shadow-cyan-500/10 backdrop-blur-sm hover:border-cyan-400/40 transition"
              >
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm uppercase tracking-[0.24em] text-cyan-300 font-semibold"
                >
                  🚨 Live Emergency Feed
                </motion.p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Critical Alert</h2>
                <p className="mt-2 text-slate-300">Fire alert issued at Tower B. Evacuate to Assembly Point Alpha.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-200 ring-1 ring-slate-500/20 cursor-pointer hover:ring-cyan-400/50 transition"
                  >
                    <p className="font-semibold text-white">Status</p>
                    <motion.p
                      animate={{ color: ['#06b6d4', '#0ea5e9', '#06b6d4'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-2 font-bold"
                    >
                      Critical
                    </motion.p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-200 ring-1 ring-slate-500/20 cursor-pointer hover:ring-cyan-400/50 transition"
                  >
                    <p className="font-semibold text-white">ETA Response</p>
                    <motion.p
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mt-2 text-cyan-300 font-bold"
                    >
                      8 min
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                variants={containerVariants}
                className="grid gap-4 sm:grid-cols-2"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-[1.75rem] bg-gradient-to-br from-cyan-500/15 to-slate-900/80 p-6 ring-1 ring-slate-500/30 cursor-pointer hover:ring-cyan-400/50 transition backdrop-blur-sm border border-cyan-500/20"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">Safety Score</p>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="mt-3 text-4xl font-bold text-cyan-300"
                  >
                    92
                  </motion.p>
                  <p className="mt-2 text-slate-400">Community readiness</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-[1.75rem] bg-gradient-to-br from-rose-500/15 to-slate-900/80 p-6 ring-1 ring-slate-500/30 cursor-pointer hover:ring-rose-400/50 transition backdrop-blur-sm border border-rose-500/20"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">Shelters</p>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="mt-3 text-4xl font-bold text-rose-300"
                  >
                    7
                  </motion.p>
                  <p className="mt-2 text-slate-400">Active zones</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

export default LandingPage;
