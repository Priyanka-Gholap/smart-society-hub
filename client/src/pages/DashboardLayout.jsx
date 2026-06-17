import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  ShieldAlert,
  Home,
  Users,
  MessageCircle,
  AlertTriangle,
  RadioTower,
  ChevronDown,
} from 'lucide-react';
import DashboardHome from './DashboardHome.jsx';
import SocietyPage from './SocietyPage.jsx';
import DisasterDashboard from './DisasterDashboard.jsx';
import ComplaintsPage from './ComplaintsPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { useAuth } from '../hooks/useAuth.js';

function DashboardLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const isEmergency = location.pathname.includes('/disaster');

  const navigation = [
    { label: 'Overview', to: 'dashboard', icon: Home, meta: 'Command grid' },
    { label: 'Society', to: 'society', icon: Users, meta: 'Members and identity' },
    { label: 'Complaints', to: 'complaints', icon: MessageCircle, meta: 'Issue operations' },
    { label: 'Disaster', to: 'disaster', icon: AlertTriangle, meta: 'Incident response' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-app-shell text-text-strong">
      <div className="sticky top-0 z-40 border-b border-border-subtle bg-shell/88 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 text-text-base transition hover:border-border-active hover:text-text-strong lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="glass-strong flex items-center gap-4 rounded-3xl px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 shadow-glow">
                <RadioTower className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="command-label">Smart Society Hub</p>
                <p className="mt-1 text-sm font-semibold text-text-strong">Emergency Command Network</p>
              </div>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-3 lg:flex">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <input
                placeholder="Search operations, shelters, alerts, or residents"
                className="command-input rounded-3xl pl-11 pr-4"
              />
            </div>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surfaceAlt/72 text-text-muted transition hover:border-border-active hover:bg-surfaceAlt hover:text-text-strong">
              <Bell size={18} />
            </button>
          </div>

          <div className="relative flex items-center gap-3">
            {isEmergency && (
              <span className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/12 px-4 py-2 text-sm font-semibold text-danger shadow-danger">
                <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse-gentle" />
                Emergency Mode
              </span>
            )}
            <button
              onClick={() => setShowUserMenu((value) => !value)}
              className="glass flex items-center gap-3 rounded-3xl px-4 py-3 text-left transition hover:border-border-active"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surfaceAlt text-sm font-semibold text-primary">
                {(user?.firstName || 'C').slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-text-strong">{user?.firstName || 'Commander'} {user?.lastName || ''}</p>
                <p className="text-xs text-text-dim">{user?.email || 'admin@smart-hub.com'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-text-dim" />
            </button>
            {showUserMenu && (
              <div className="glass-strong absolute right-0 top-full mt-3 w-[260px] overflow-hidden rounded-3xl">
                <div className="border-b border-border-subtle px-4 py-4">
                  <p className="text-sm font-semibold text-text-strong">{user?.firstName || 'Commander'} {user?.lastName || ''}</p>
                  <p className="mt-1 text-xs text-text-dim">{user?.email || 'admin@smart-hub.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-danger transition hover:bg-white/5"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
        <aside
          className={`glass-strong fixed inset-y-0 left-0 z-50 w-full max-w-[320px] transform border-r border-border-subtle p-6 transition duration-300 lg:static lg:translate-x-0 lg:rounded-[2rem] ${
            sidebarOpen ? 'translate-x-0 shadow-glass' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div>
              <p className="command-label">Command Rail</p>
              <h2 className="mt-1 text-xl font-semibold text-text-strong">Operations</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 text-text-base transition hover:border-border-active"
            >
              <X size={20} />
            </button>
          </div>

          <div className="hidden lg:block">
            <p className="command-label">Navigation</p>
            <h2 className="mt-2 text-2xl font-semibold text-text-strong">Emergency Command Center</h2>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.includes(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-4 overflow-hidden rounded-[1.5rem] border px-4 py-4 transition ${
                    active
                      ? 'border-primary/20 bg-primary/12 text-primary shadow-glow'
                      : 'border-transparent text-text-muted hover:border-border-subtle hover:bg-white/5 hover:text-text-strong'
                  }`}
                >
                  {active && <span className="absolute inset-y-4 left-0 w-1 rounded-full bg-primary" />}
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    active
                      ? 'border-primary/20 bg-primary/12 text-primary'
                      : 'border-border-subtle bg-surface/80 text-text-dim group-hover:border-border-active group-hover:text-text-strong'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className={`mt-1 text-xs ${active ? 'text-primary/80' : 'text-text-dim'}`}>{item.meta}</p>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="alert-banner alert-info mt-8">
            <div className="relative flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-primary animate-pulse-gentle" />
              <div>
                <p className="command-label text-primary">Command Mission</p>
                <p className="mt-2 text-sm font-semibold text-text-strong">Maintain high readiness across society operations.</p>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Coordinate residents, validate signals quickly, and escalate only verified emergency events.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-border-subtle bg-surface/78 p-5 shadow-inset">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="command-label">System State</p>
                <p className="mt-2 text-base font-semibold text-text-strong">Command mesh synchronized</p>
              </div>
              <ShieldAlert className="h-5 w-5 text-secondary" />
            </div>
          </div>
        </aside>

        {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="sidebar-backdrop lg:hidden" aria-label="Close sidebar" />}

        <main className="space-y-6">
          <div className="glass lg:hidden rounded-[1.8rem] p-4">
            <p className="command-label">Mobile Command</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-text-strong">Smart Society Hub</p>
                <p className="text-sm text-text-dim">Operations console</p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 text-text-base"
              >
                <Menu size={20} />
              </button>
            </div>
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
