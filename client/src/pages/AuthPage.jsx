import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck, RadioTower } from 'lucide-react';
import LoginForm from '../components/common/LoginForm.jsx';
import RegisterForm from '../components/common/RegisterForm.jsx';

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app-shell px-6 py-12 text-text-strong lg:px-8">
      <motion.div
        className="absolute left-[14%] top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, 36, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[12%] h-72 w-72 rounded-full bg-secondary/8 blur-3xl"
        animate={{ y: [0, -34, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-[1400px] gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="glass-strong flex flex-col justify-between rounded-[2rem] p-8 lg:p-10"
        >
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 shadow-glow">
                <RadioTower className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="command-label">Smart Society Hub</p>
                <p className="mt-1 text-sm font-semibold text-text-strong">Protected command access</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold text-text-strong lg:text-5xl">
                Secure access for operational teams and residents
              </h1>
              <p className="max-w-xl text-base leading-8 text-text-muted">
                Authenticate into the command center to manage societies, coordinate emergency alerts, review complaints, and monitor community resilience.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Role-based access', icon: LockKeyhole },
                { label: 'Verified command actions', icon: ShieldCheck },
                { label: 'Live society monitoring', icon: RadioTower },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.55rem] border border-border-subtle bg-surface/70 p-5 shadow-inset">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-medium text-text-base">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="rounded-[1.7rem] border border-border-subtle bg-surface/72 p-6 shadow-inset">
            <p className="command-label">Control Assurance</p>
            <p className="mt-2 text-lg font-semibold text-text-strong">All access flows are designed for trusted community coordination.</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Sign in for dashboard access or create a resident account to join your society and receive emergency notifications.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="glass rounded-[2rem] border border-border-subtle p-8 lg:p-10"
        >
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-semibold text-text-strong">Authentication Portal</h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-text-muted">
              Access the premium command interface with the same design system used across the operational dashboard.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link
                className="rounded-full border border-primary/20 bg-primary/12 px-4 py-2 font-medium text-primary transition hover:bg-primary/18"
                to="login"
              >
                Sign In
              </Link>
              <Link
                className="rounded-full border border-border-subtle bg-surface/72 px-4 py-2 font-medium text-text-base transition hover:border-border-active hover:text-text-strong"
                to="register"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-3xl">
            <Routes>
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="*" element={<LoginForm />} />
            </Routes>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default AuthPage;
