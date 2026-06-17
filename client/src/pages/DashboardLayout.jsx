import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Search, Bell, ShieldAlert, Home, Users, MessageCircle, AlertTriangle } from 'lucide-react';
import DashboardHome from './DashboardHome.jsx';
import SocietyPage from './SocietyPage.jsx';
import DisasterDashboard from './DisasterDashboard.jsx';
import ComplaintsPage from './ComplaintsPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { useAuth } from '../hooks/useAuth.js';

function DashboardLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  console.log('isAuthenticated =', isAuthenticated);
  console.log('user =', user);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const isEmergency = location.pathname.includes('/disaster');

  const navigation = [
    { label: 'Dashboard', to: 'dashboard', icon: Home },
    { label: 'Society', to: 'society', icon: Users },
    { label: 'Complaints', to: 'complaints', icon: MessageCircle },
    { label: 'Disaster', to: 'disaster', icon: AlertTriangle },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-slate-200 transition hover:bg-slate-900/90 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="rounded-3xl border border-white/10 bg-surface/90 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Smart Society Hub</p>
              <p className="text-base font-semibold">Disaster-Ready Communities</p>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-3 lg:flex">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Search operations, alerts, or shelters"
                className="w-full rounded-3xl border border-white/10 bg-surface/90 py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-surface/90 text-slate-200 transition hover:bg-slate-900/90">
              <Bell size={20} />
            </button>
          </div>

          <div className="relative flex items-center gap-3">
            {isEmergency && (
              <span className="rounded-full bg-danger/15 px-4 py-2 text-sm font-semibold text-danger ring-1 ring-danger/20">
                Emergency mode
              </span>
            )}
            <button
              onClick={() => setShowUserMenu((value) => !value)}
              className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-surface/90 px-4 py-3 text-left transition hover:bg-slate-900/90"
            >
              <div>
                <p className="text-sm font-semibold text-white">{user?.firstName || 'Commander'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'admin@smart-hub.com'}</p>
              </div>
              <span className="text-slate-300">▼</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-[260px] overflow-hidden rounded-3xl border border-white/10 bg-surface/95 shadow-soft backdrop-blur-xl">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-danger transition hover:bg-white/5"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1480px] grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-[300px] transform border-r border-white/10 bg-surface/95 p-6 backdrop-blur-2xl transition duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? 'translate-x-0 shadow-soft' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Command Center</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Smart Society</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-200 transition hover:bg-slate-900/90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 hidden lg:block">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Navigation</p>
          </div>

          <nav className="mt-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.includes(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-primary/15 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`${active ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`} size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#0B1120]/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current mission</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Maintain alert readiness, support citizen safety, and coordinate local volunteer response during incidents.
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-[#111827] px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-1 text-sm font-semibold text-white">All systems nominal</p>
              </div>
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
          </div>
        </aside>

        {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="sidebar-backdrop lg:hidden" aria-label="Close sidebar" />}

        <main className="px-4 py-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <div className="flex-1 rounded-3xl border border-white/10 bg-surface/90 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Command Center</p>
              <p className="mt-2 text-lg font-semibold text-white">Smart Society Hub</p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-200 transition hover:bg-slate-900/90"
            >
              <Menu size={20} />
            </button>
          </div>

          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="society" element={<SocietyPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="disaster" element={<DisasterDashboard />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
