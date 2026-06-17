import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BellRing, Building2, ShieldCheck, Siren, Users } from 'lucide-react';

const heroVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app-shell text-text-strong">
      <motion.div
        className="absolute left-[8%] top-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, 28, 0], x: [-18, 18, -18] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[10%] top-24 h-72 w-72 rounded-full bg-secondary/8 blur-3xl"
        animate={{ y: [0, -24, 0], x: [14, -14, 14] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-6 py-12 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="grid gap-12 xl:grid-cols-[1.08fr_0.92fr] xl:items-center"
        >
          <motion.div className="space-y-8" variants={containerVariants}>
            <motion.div variants={itemVariants} className="glass inline-flex items-center gap-3 rounded-full px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-gentle" />
              <span className="text-sm font-medium text-text-base">Premium command software for resilient communities</span>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.h1
                variants={itemVariants}
                className="max-w-4xl text-5xl font-bold leading-tight text-text-strong sm:text-6xl xl:text-[4.35rem]"
              >
                Smart Society Hub for
                <span className="block bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent">
                  society intelligence and emergency control
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="max-w-2xl text-lg leading-8 text-text-muted"
              >
                Unify society management, complaint tracking, emergency alerts, location intelligence, and disaster response through a futuristic operations platform built for trust.
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link to="/auth/login" className="btn-primary px-8 py-3 text-base">
                Enter Command Center
              </Link>
              <Link to="/app/dashboard" className="btn-secondary px-8 py-3 text-base">
                Explore Live Demo
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Emergency Alerts', value: 'Real-time', icon: Siren },
                { label: 'Society Management', value: 'Unified', icon: Building2 },
                { label: 'Community Response', value: 'Mobile-ready', icon: Users },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.55rem] border border-border-subtle bg-surface/68 p-5 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="command-label">{item.label}</p>
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-text-strong">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-strong animate-float-panel relative overflow-hidden rounded-[2rem] p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.12),transparent_18%)]" />
            <div className="relative z-10 space-y-6">
              <div className="alert-banner alert-danger">
                <div className="relative flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-danger animate-pulse-gentle" />
                  <div>
                    <p className="command-label text-red-200">Live Emergency Feed</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Critical incident active at Tower B</h2>
                    <p className="mt-2 text-sm leading-6 text-red-100/85">
                      Evacuation notice dispatched to residents. Assembly Point Alpha open and medical relay prepared.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-primary/20 bg-primary/10 p-5 shadow-glow">
                  <div className="flex items-center justify-between gap-3">
                    <p className="command-label text-primary">Command Health</p>
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-4 text-4xl font-semibold text-text-strong">92%</p>
                  <p className="mt-2 text-sm text-text-muted">Operational readiness across connected communities</p>
                </div>
                <div className="rounded-[1.6rem] border border-border-subtle bg-surface/70 p-5 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="command-label">Signal Queue</p>
                    <BellRing className="h-4 w-4 text-warning" />
                  </div>
                  <p className="mt-4 text-4xl font-semibold text-text-strong">08</p>
                  <p className="mt-2 text-sm text-text-muted">Emergency alerts, notices, and task escalations in progress</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border-subtle bg-surface/70 p-6 shadow-inset">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="command-label">Platform Coverage</p>
                    <p className="mt-2 text-xl font-semibold text-text-strong">Society Management + Disaster Command + Community Notices</p>
                  </div>
                  <span className="rounded-full border border-secondary/20 bg-secondary/12 px-3 py-1 text-sm font-semibold text-secondary">
                    Multi-module
                  </span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    'Complaint tracking',
                    'Emergency contacts',
                    'Location-based shelters',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border-subtle bg-backgroundAlt/76 px-4 py-3 text-sm text-text-base">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

export default LandingPage;
