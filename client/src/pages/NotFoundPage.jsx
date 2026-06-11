import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div className="max-w-xl rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-10 shadow-2xl shadow-cyan-500/10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404 error</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-400">The page you are looking for does not exist. Return to the dashboard or home page.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Home</Link>
          <Link to="/app/dashboard" className="inline-flex rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
