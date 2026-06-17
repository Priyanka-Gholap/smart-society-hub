import { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, AlertTriangle, BellRing, ShieldCheck, Users, Building2, Siren, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';

function DashboardHome() {
  const { user } = useAuth();
  const societyId =
    typeof user?.society === 'object' ? user?.society?._id || user?.society?.id : user?.society;
  const [stats, setStats] = useState({
    safeResidents: 0,
    needAssistance: 0,
    activeAlerts: 0,
    volunteersReady: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [safety, setSafety] = useState({
    shelterCapacity: 0,
    resourceStock: 0,
    alertsResolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!societyId) {
          setAlerts([]);
          setSafety({
            shelterCapacity: 0,
            resourceStock: 0,
            alertsResolved: 0,
          });
          setStats({
            safeResidents: 0,
            needAssistance: 0,
            activeAlerts: 0,
            volunteersReady: 0,
          });
          return;
        }

        const [statsRes, alertsRes, safetyRes] = await Promise.all([
          api.get(`/societies/${societyId}/statistics`),
          api.get('/disaster/alerts?limit=5'),
          api.get('/disaster/safety-status'),
        ]);

        if (statsRes.data.success) {
          const data = statsRes.data.statistics || {};
          setStats({
            safeResidents: data.totalResidents || 0,
            needAssistance: data.needAssistance || 0,
            activeAlerts: data.activeAlerts || 0,
            volunteersReady: data.volunteers || 0,
          });
        }

        if (alertsRes.data.success) {
          setAlerts(alertsRes.data.alerts || []);
        }

        if (safetyRes.data.success) {
          const summary = safetyRes.data.summary || [];
          const safeCount = summary.find((item) => item._id === 'safe')?.count || 0;
          const needAssistanceCount =
            (summary.find((item) => item._id === 'need_assistance')?.count || 0) +
            (summary.find((item) => item._id === 'emergency')?.count || 0);
          const totalStatuses = summary.reduce((count, item) => count + item.count, 0);

          setStats((prev) => ({
            ...prev,
            safeResidents: safeCount,
            needAssistance: needAssistanceCount,
          }));
          setSafety({
            shelterCapacity: 82,
            resourceStock: 74,
            alertsResolved: totalStatuses ? Math.round((safeCount / totalStatuses) * 100) : 0,
          });
        }
      } catch (requestError) {
        console.error('Dashboard data fetch error:', requestError);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [societyId]);

  const analyticsData = [
    { label: 'Alerts', value: stats.activeAlerts },
    { label: 'Assistance', value: stats.needAssistance },
    { label: 'Volunteers', value: stats.volunteersReady },
    { label: 'Residents', value: stats.safeResidents },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surfaceAlt border-t-primary"></div>
          <p className="text-text-dim">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!societyId) {
    return (
      <div className="command-card p-8 text-text-muted">
        Join or create a society to unlock dashboard analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert-banner alert-danger">
          <div className="relative flex items-center gap-3 text-sm font-medium text-red-100">
            <span className="h-3 w-3 rounded-full bg-danger animate-pulse-gentle" />
            {error}
          </div>
        </div>
      )}

      <GlassCard className="overflow-hidden p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="command-label text-primary">Overview Dashboard</p>
            <h1 className="text-3xl font-semibold text-text-strong sm:text-4xl">Operational intelligence for society response</h1>
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              Monitor incident escalation, resident wellbeing, volunteer readiness, and shelter stability through a premium emergency command interface.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-[1.6rem] border border-primary/20 bg-primary/10 px-4 py-3 shadow-glow">
              <p className="command-label text-primary">Live Readiness</p>
              <p className="mt-2 text-2xl font-semibold text-text-strong">92%</p>
            </div>
            <div className="rounded-[1.6rem] border border-border-subtle bg-surface/78 px-4 py-3">
              <p className="command-label">System Feed</p>
              <p className="mt-2 text-2xl font-semibold text-text-strong">{alerts.length} active signals</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Safe Residents', value: stats.safeResidents, icon: ShieldCheck, tone: 'text-primary', panel: 'from-primary/12 via-transparent to-transparent' },
          { title: 'Need Assistance', value: stats.needAssistance, icon: Activity, tone: 'text-warning', panel: 'from-warning/12 via-transparent to-transparent' },
          { title: 'Active Alerts', value: stats.activeAlerts, icon: Siren, tone: 'text-danger', panel: 'from-danger/12 via-transparent to-transparent' },
          { title: 'Volunteers Ready', value: stats.volunteersReady, icon: Users, tone: 'text-secondary', panel: 'from-secondary/12 via-transparent to-transparent' },
        ].map((card) => (
          <GlassCard key={card.title} className={`metric-card bg-gradient-to-br ${card.panel}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="command-label">{card.title}</p>
                <p className="mt-5 text-4xl font-semibold text-text-strong">
                  <AnimatedCounter value={card.value} format={(value) => value.toLocaleString()} />
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 ${card.tone}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="command-label">Analytics</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-strong">Incident flow and command load</h2>
            </div>
            <StatusBadge label="Past 30 days" variant="primary" />
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-border-subtle bg-surface/72 p-4 shadow-inset">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 16, right: 0, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#0e7490" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.10)" />
                  <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#081120',
                      borderRadius: 18,
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="value" radius={[16, 16, 6, 6]} fill="url(#dashboardBarGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="command-label">Readiness</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-strong">Disaster status widgets</h2>
              </div>
              <StatusBadge label={stats.activeAlerts > 0 ? 'Watch' : 'Stable'} variant={stats.activeAlerts > 0 ? 'danger' : 'success'} />
            </div>

            <div className="mt-7 space-y-4">
              {[
                { label: 'Shelter capacity', value: `${safety.shelterCapacity}%`, progress: safety.shelterCapacity, icon: Building2 },
                { label: 'Resource stock', value: `${safety.resourceStock}%`, progress: safety.resourceStock, icon: Shield },
                { label: 'Alerts resolved', value: `${safety.alertsResolved}%`, progress: safety.alertsResolved, icon: BellRing },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-border-subtle bg-surface/70 p-5 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border-subtle bg-surfaceAlt/78 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-text-muted">{item.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-strong">{item.value}</p>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-backgroundAlt">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="command-label">Notification Center</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-strong">Latest emergency alerts</h2>
              </div>
              <StatusBadge label="Live Feed" variant="secondary" />
            </div>

            <div className="mt-6 space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert._id || alert.id} className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-4 transition hover:border-border-active hover:bg-surfaceAlt/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-strong">{alert.title || 'Community alert'}</p>
                      <p className="mt-2 text-sm leading-6 text-text-muted">{alert.description || 'No details available.'}</p>
                    </div>
                    <StatusBadge label={alert.level || 'warning'} variant={alert.level === 'critical' ? 'danger' : alert.level === 'warning' ? 'warning' : 'success'} />
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 text-sm text-text-dim">
                  No active community alerts right now.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
