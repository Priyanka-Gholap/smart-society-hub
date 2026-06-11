import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, BellRing, ShieldCheck, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import api from '../utils/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';

function DashboardHome() {
  const { user } = useAuth();
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

        if (user?.society) {
          const statsRes = await api.get(`/societies/${user.society}/statistics`);
          if (statsRes.data.success) {
            const data = statsRes.data.statistics || {};
            setStats({
              safeResidents: data.safeResidents || 0,
              needAssistance: data.needAssistance || 0,
              activeAlerts: data.activeAlerts || 0,
              volunteersReady: data.volunteersReady || 0,
            });
          }
        }

        const alertsRes = await api.get('/disaster/alerts?limit=5');
        if (alertsRes.data.success) {
          setAlerts(alertsRes.data.alerts || []);
        }

        const safetyRes = await api.get('/disaster/safety-status');
        if (safetyRes.data.success) {
          setSafety(safetyRes.data.status || {});
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const analyticsData = [
    { label: 'Alerts', value: stats.activeAlerts },
    { label: 'Assistance', value: stats.needAssistance },
    { label: 'Volunteers', value: stats.volunteersReady },
    { label: 'Shelters', value: safety.shelterCapacity || 0 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-[2rem] border border-danger/30 bg-danger/10 p-4 text-danger">
          {error}
        </div>
      )}

      <GlassCard className="p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Overview</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Operational insights</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Monitor real-time safety metrics, incident activity, and volunteer readiness across communities with premium clarity.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-surface/90 px-5 py-3 text-sm text-slate-200 ring-1 ring-primary/20">
            <BellRing className="h-4 w-4 text-primary" />
            {stats.activeAlerts > 0 ? 'Emergency alerts detected' : 'No active emergencies'}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Safe residents', value: stats.safeResidents, icon: ShieldCheck, accent: 'from-primary/20 to-surface' },
            { title: 'Need assistance', value: stats.needAssistance, icon: Activity, accent: 'from-warning/20 to-surface' },
            { title: 'Active alerts', value: stats.activeAlerts, icon: AlertTriangle, accent: 'from-danger/20 to-surface' },
            { title: 'Volunteers ready', value: stats.volunteersReady, icon: Users, accent: 'from-secondary/20 to-surface' },
          ].map((card) => (
            <GlassCard key={card.title} className={`p-6 bg-white/5 border-white/10 bg-gradient-to-br ${card.accent}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">{card.title}</p>
                <card.icon className="h-5 w-5 text-slate-200" />
              </div>
              <p className="mt-5 text-4xl font-semibold text-white">
                <AnimatedCounter value={card.value} format={(value) => value.toLocaleString()} />
              </p>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Analytics</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Incident trends</h2>
            </div>
            <StatusBadge label="Past 30 days" variant="primary" className="!rounded-full px-4 py-2 text-sm" />
          </div>
          <div className="mt-8 h-[340px] rounded-[1.75rem] bg-[#0B1120]/80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 16, right: 0, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: 16,
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                />
                <Bar dataKey="value" radius={[16, 16, 0, 0]} fill="url(#dashboardBarGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Live status</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Emergency readiness</h2>
            </div>
            <StatusBadge label={stats.activeAlerts > 0 ? 'Alert active' : 'Stable'} variant={stats.activeAlerts > 0 ? 'danger' : 'success'} className="text-sm" />
          </div>

          <div className="mt-8 space-y-5">
            {[
              { label: 'Shelter capacity', value: `${safety.shelterCapacity || 0}% full`, progress: safety.shelterCapacity || 0 },
              { label: 'Resource stock', value: `${safety.resourceStock || 0}% stable`, progress: safety.resourceStock || 0 },
              { label: 'Alerts resolved', value: `${safety.alertsResolved || 0}%`, progress: safety.alertsResolved || 0 },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] bg-surface/80 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-surface/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Latest alerts</p>
                <p className="mt-1 text-sm text-white">{alerts.length} reports in the last 48 hours</p>
              </div>
              <StatusBadge label="Live feed" variant="secondary" />
            </div>

            <div className="mt-6 space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert._id || alert.id} className="rounded-3xl border border-white/10 bg-[#0B1120]/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{alert.title || 'Community alert'}</p>
                    <StatusBadge label={alert.level || 'warning'} variant={alert.level === 'critical' ? 'danger' : alert.level === 'warning' ? 'warning' : 'success'} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{alert.description || 'No details available.'}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default DashboardHome;
