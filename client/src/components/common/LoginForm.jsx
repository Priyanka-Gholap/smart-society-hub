import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(form.email, form.password);

      if (result.success) {
        navigate('/app/dashboard');
      } else {
        setError(result.error);
      }
    } catch (requestError) {
      console.error(requestError);
      setError('Login failed');
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
      className="space-y-6 rounded-[1.85rem] border border-border-subtle bg-surface/76 p-8 shadow-inset"
    >
      {error && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-rose-200"
        >
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <label className="command-label text-text-muted" htmlFor="email">
          Email Address
        </label>
        <motion.input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="command-input mt-3"
          placeholder="you@example.com"
          whileFocus={{ scale: 1.02 }}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="command-label text-text-muted" htmlFor="password">
          Password
        </label>
        <motion.input
          id="password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          className="command-input mt-3"
          placeholder="Enter your password"
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
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </motion.button>

      <motion.p variants={itemVariants} className="text-center text-sm text-text-dim">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-primary transition hover:text-cyan-300">
          Create one
        </Link>
      </motion.p>
    </motion.form>
  );
}

export default LoginForm;
