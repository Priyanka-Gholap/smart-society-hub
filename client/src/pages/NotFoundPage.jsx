import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-shell px-6 text-center text-text-strong">
      <div className="glass-strong max-w-xl rounded-[2rem] p-10">
        <p className="command-label text-primary">404 Error</p>
        <h1 className="mt-6 text-5xl font-semibold text-text-strong">Page not found</h1>
        <p className="mt-4 text-text-muted">
          The page you are looking for does not exist. Return to the home page or enter the dashboard.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary px-6 py-3 text-sm">
            Home
          </Link>
          <Link to="/app/dashboard" className="btn-secondary px-6 py-3 text-sm">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
