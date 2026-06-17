import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "../../hooks/useAuth.js";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-2xl shadow-cyan-500/10"
    >
      {error && (
        <motion.div
          variants={itemVariants}
          className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-sm text-rose-300"
        >
          {error}
        </motion.div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <label className="text-sm font-semibold text-slate-300" htmlFor="firstName">
            First Name
          </label>
          <motion.input
            id="firstName"
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            placeholder="John"
            whileFocus={{ scale: 1.02 }}
            required
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="text-sm font-semibold text-slate-300" htmlFor="lastName">
            Last Name
          </label>
          <motion.input
            id="lastName"
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            placeholder="Doe"
            whileFocus={{ scale: 1.02 }}
            required
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <label className="text-sm font-semibold text-slate-300" htmlFor="email">
          Email Address
        </label>
        <motion.input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          placeholder="you@example.com"
          whileFocus={{ scale: 1.02 }}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-sm font-semibold text-slate-300" htmlFor="phone">
          Phone Number
        </label>
        <motion.input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          placeholder="+91 98765 43210"
          whileFocus={{ scale: 1.02 }}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-sm font-semibold text-slate-300" htmlFor="password">
          Password
        </label>
        <motion.input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          placeholder="••••••••"
          whileFocus={{ scale: 1.02 }}
          required
        />
      </motion.div>

      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-lg hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </motion.button>

      <motion.p variants={itemVariants} className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <a href="/auth/login" className="text-cyan-300 hover:text-cyan-200 font-semibold transition">
          Sign in
        </a>
      </motion.p>
    </motion.form>
  );
}

export default RegisterForm;
