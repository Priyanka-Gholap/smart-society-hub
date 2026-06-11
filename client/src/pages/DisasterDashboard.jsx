import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/api.js';
import useAuth from '../hooks/useAuth.js';
import { useSocket } from '../context/SocketContext.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import FloatingActionButton from '../components/common/FloatingActionButton.jsx';
import Toast from '../components/common/Toast.jsx';

function DisasterDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [data, setData] = useState({
    alerts: 0,
    sosActive: 0,
    sheltersOnline: 0,
    volunteers: 0,
  });
  const [safety, setSafety] = useState({
    safe: 128,
    needAssistance: 16,
    emergency: 5,
  });
  const [isDisasterMode, setIsDisasterMode] = useState(false);
  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    type: 'flood',
    level: 'warning',
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user?.society) return;
    fetchDisasterData();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on('alert_notification', () => {
      setData((prev) => ({ ...prev, alerts: prev.alerts + 1 }));
      setToast({ message: 'New alert received in your society', variant: 'warning' });
      window.setTimeout(() => setToast(null), 3500);
    });

    socket.on('safety_status_update', (status) => {
      setSafety(status);
    });

    return () => {
      socket.off('alert_notification');
      socket.off('safety_status_update');
    };
  }, [socket]);

  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      const alertsRes = await api.get('/disaster/alerts?limit=1');
      const sheltersRes = await api.get('/disaster/shelters');
      const volunteersRes = await api.get('/disaster/volunteers');
      const safetyRes = await api.get('/disaster/safety-status');

      setData({
        alerts: alertsRes.data.alerts?.length || 0,
        sosActive: alertsRes.data.alertsActive || 0,
        sheltersOnline: sheltersRes.data.shelters?.length || 0,
        volunteers: volunteersRes.data.volunteers?.length || 0,
      });

      if (safetyRes.data.success) {
        setSafety(safetyRes.data.status || safety);
      }
    } catch (err) {
      console.error('Failed to fetch disaster data:', err);
      setToast({ message: 'Unable to load disaster metrics', variant: 'danger' });
      window.setTimeout(() => setToast(null), 3500);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();

    try {
      await api.post('/disaster/alerts', alertForm);
      setAlertForm({ title: '', description: '', type: 'flood', level: 'warning' });
      setToast({ message: 'Emergency alert dispatched', variant: 'success' });
      window.setTimeout(() => setToast(null), 3500);
      fetchDisasterData();
    } catch (err) {
      console.error('Failed to create alert:', err);
      setToast({ message: 'Alert dispatch failed', variant: 'danger' });
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  const handleActivateDisasterMode = async () => {
    try {
      await api.post('/disaster/activate-disaster-mode');
      setIsDisasterMode(true);
      setToast({ message: 'Disaster mode activated', variant: 'success' });
      window.setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error('Failed to activate disaster mode:', err);
      setToast({ message: 'Unable to enable disaster mode', variant: 'danger' });
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-danger"></div>
          <p className="text-slate-400">Loading disaster data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      <Toast message={toast?.message || ''} variant={toast?.variant || 'info'} visible={Boolean(toast)} />

      <GlassCard className="p-8 border-danger/20 bg-slate-950/90">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Disaster mode</p>
            <h1 className="text-3xl font-semibold text-white">Crisis response center</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Coordinate emergency operations, shelter readiness, and volunteer mobilization with a premium incident-control dashboard.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <StatusBadge
              label={isDisasterMode ? 'Active' : 'Standby'}
              variant={isDisasterMode ? 'danger' : 'success'}
              className="text-sm"
            />
            <button
              type="button"
              onClick={handleActivateDisasterMode}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                isDisasterMode
                  ? 'bg-rose-500/30 text-rose-300 ring-rose-500/20'
                  : 'bg-primary text-slate-950 shadow-glow hover:brightness-105'
              }`}
            >
              {isDisasterMode ? 'Disaster Mode Active' : 'Activate Disaster Mode'}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Alerts', value: data.alerts, accent: 'from-rose-500/20 to-slate-950' },
            { label: 'SOS active', value: data.sosActive, accent: 'from-warning/20 to-slate-950' },
            { label: 'Shelters online', value: data.sheltersOnline, accent: 'from-primary/20 to-slate-950' },
            { label: 'Volunteers', value: data.volunteers, accent: 'from-success/20 to-slate-950' },
          ].map((block) => (
            <GlassCard key={block.label} className={`p-6 bg-gradient-to-br ${block.accent} border-white/10`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">{block.label}</p>
                <span className="rounded-2xl bg-white/10 px-3 py-2 text-xs uppercase text-slate-200">Live</span>
              </div>
              <p className="mt-5 text-4xl font-semibold text-white">
                <AnimatedCounter value={block.value} format={(value) => value.toLocaleString()} />
              </p>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <GlassCard className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Emergency map</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Live hazard zones</h2>
            </div>
            <StatusBadge label="Map" variant="secondary" />
          </div>
          <div className="mt-8 h-[420px] rounded-[1.5rem] bg-gradient-to-br from-[#0b1222] via-[#111827] to-[#111827] p-6">
            <div className="relative h-full rounded-[1.5rem] border border-white/5 bg-[#0b1220]/80">
              <div className="absolute left-8 top-10 h-4 w-4 rounded-full bg-danger shadow-[0_0_24px_rgba(239,68,68,0.45)] animate-pulse-gentle" />
              <div className="absolute left-28 top-28 h-4 w-4 rounded-full bg-warning shadow-[0_0_20px_rgba(245,158,11,0.35)] animate-pulse-gentle" />
              <div className="absolute right-16 top-24 h-4 w-4 rounded-full bg-primary shadow-[0_0_24px_rgba(6,182,212,0.45)] animate-pulse-gentle" />
              <div className="absolute inset-0 flex items-end justify-center p-8 text-center text-slate-500 opacity-80">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em]">Dark terrain analytics</p>
                  <p className="text-lg text-white">Map integration coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Safety index</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Resident wellbeing</h2>
          </div>

          <div className="mt-8 space-y-6">
            {[
              { label: 'Safe', count: safety.safe || 128, tone: 'bg-primary' },
              { label: 'Need assistance', count: safety.needAssistance || 16, tone: 'bg-warning' },
              { label: 'Emergency', count: safety.emergency || 5, tone: 'bg-danger' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-[#111827]/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold text-slate-950 ${item.tone}`}>{item.count}</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className={`${item.tone} h-full rounded-full`} style={{ width: `${Math.min(item.count, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] bg-surface/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Risk levels</p>
                <p className="mt-1 text-sm text-white">Current hazard score across zones</p>
              </div>
              <StatusBadge label="Critical" variant="danger" />
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Flood', value: 78, tone: 'bg-warning' },
                { label: 'Fire', value: 65, tone: 'bg-danger' },
                { label: 'Wind', value: 42, tone: 'bg-secondary' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className={`${item.tone} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <FloatingActionButton label="Log incident" onClick={() => setToast({ message: 'Incident log workflow is ready', variant: 'info' })} icon={<Plus size={16} />} />
    </div>
  );
}

export default DisasterDashboard;
