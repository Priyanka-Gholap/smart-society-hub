import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function AuthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black px-6 py-16 text-slate-100 relative overflow-hidden">
      {/* Background animated orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-10 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl"
      >
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-4 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold text-white"
          >
            Secure access for every{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              community member
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-slate-400"
          >
            Sign in to monitor society operations, emergency status, and resident collaboration tools.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-6 text-sm"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="px-4 py-2 rounded-lg text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 transition ring-1 ring-cyan-500/30"
                to="login"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="px-4 py-2 rounded-lg text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 transition ring-1 ring-cyan-500/30"
                to="register"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="mx-auto w-full max-w-3xl"
        >
          <Routes>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="*" element={<LoginForm />} />
          </Routes>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default AuthPage;
