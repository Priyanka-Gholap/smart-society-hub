import { useEffect, useState } from 'react';
import { Plus, ShieldAlert, MapPinned, Users, Building2 } from 'lucide-react';
import api from '../utils/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { useSocket } from '../context/SocketContext.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import FloatingActionButton from '../components/common/FloatingActionButton.jsx';
import Toast from '../components/common/Toast.jsx';

function DisasterDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const societyId =
    typeof user?.society === 'object' ? user?.society?._id || user?.society?.id : user?.society;
  const [data, setData] = useState({
    alerts: 0,
    sosActive: 0,
    sheltersOnline: 0,
    volunteers: 0,
  });
  const [safety, setSafety] = useState({
    safe: 0,
    needAssistance: 0,
    emergency: 0,
  });
  const [isDisasterMode, setIsDisasterMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        setLoading(true);

        if (!societyId) {
          return;
        }

        const [alertsRes, sheltersRes, volunteersRes, safetyRes] = await Promise.all([
          api.get('/disaster/alerts?limit=20'),
          api.get('/disaster/shelters'),
          api.get('/disaster/volunteers'),
          api.get('/disaster/safety-status'),
        ]);

        setData({
          alerts: alertsRes.data.alerts?.length || 0,
          sosActive: alertsRes.data.alerts?.filter((alert) => alert.status === 'active').length || 0,
          sheltersOnline: sheltersRes.data.shelters?.length || 0,
          volunteers: volunteersRes.data.volunteers?.length || 0,
        });

        if (safetyRes.data.success) {
          const summary = safetyRes.data.summary || [];
          setSafety({
            safe: summary.find((item) => item._id === 'safe')?.count || 0,
            needAssistance: summary.find((item) => item._id === 'need_assistance')?.count || 0,
            emergency: summary.find((item) => item._id === 'emergency')?.count || 0,
          });
        }
      } catch (requestError) {
        console.error('Failed to fetch disaster data:', requestError);
        setToast({ message: 'Unable to load disaster metrics', variant: 'danger' });
        window.setTimeout(() => setToast(null), 3500);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterData();
  }, [societyId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleEmergencyAlert = () => {
      setData((prev) => ({ ...prev, alerts: prev.alerts + 1 }));
      setToast({ message: 'New alert received in your society', variant: 'warning' });
      window.setTimeout(() => setToast(null), 3500);
    };

    const handleSafetyUpdate = () => {
      setToast({ message: 'Safety status updated', variant: 'info' });
      window.setTimeout(() => setToast(null), 3500);
    };

    const handleModeEnabled = () => {
      setIsDisasterMode(true);
    };

    const handleModeDisabled = () => {
      setIsDisasterMode(false);
    };

    socket.on('emergency_alert', handleEmergencyAlert);
    socket.on('safety_status_update', handleSafetyUpdate);
    socket.on('disaster_mode_activated', handleModeEnabled);
    socket.on('disaster_mode_deactivated', handleModeDisabled);

    return () => {
      socket.off('emergency_alert', handleEmergencyAlert);
      socket.off('safety_status_update', handleSafetyUpdate);
      socket.off('disaster_mode_activated', handleModeEnabled);
      socket.off('disaster_mode_deactivated', handleModeDisabled);
    };
  }, [socket]);

  const handleActivateDisasterMode = async () => {
    try {
      await api.post('/disaster/activate-disaster-mode');
      setIsDisasterMode(true);
      setToast({ message: 'Disaster mode activated', variant: 'success' });
      window.setTimeout(() => setToast(null), 3500);
    } catch (requestError) {
      console.error('Failed to activate disaster mode:', requestError);
      setToast({ message: 'Unable to enable disaster mode', variant: 'danger' });
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surfaceAlt border-t-danger"></div>
          <p className="text-text-dim">Loading disaster data...</p>
        </div>
      </div>
    );
  }

  if (!societyId) {
    return (
      <div className="command-card p-8 text-text-muted">
        Join or create a society to access disaster operations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast message={toast?.message || ''} variant={toast?.variant || 'info'} visible={Boolean(toast)} />

      <div className="alert-banner alert-danger">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 rounded-full bg-danger animate-pulse-gentle" />
            <div>
              <p className="command-label text-red-200">Emergency Alerts</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Disaster monitoring and response control</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100/85">
                Coordinate hazard monitoring, shelter activation, volunteer mobilization, and live safety reporting from a single command surface.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <StatusBadge label={isDisasterMode ? 'Mode Active' : 'Standby'} variant={isDisasterMode ? 'danger' : 'warning'} />
            <button type="button" onClick={handleActivateDisasterMode} className={isDisasterMode ? 'btn-danger' : 'btn-primary'}>
              {isDisasterMode ? 'Disaster Mode Active' : 'Activate Disaster Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Emergency Alerts', value: data.alerts, icon: ShieldAlert, tone: 'text-danger' },
          { label: 'SOS Signals', value: data.sosActive, icon: MapPinned, tone: 'text-warning' },
          { label: 'Nearby Shelters', value: data.sheltersOnline, icon: Building2, tone: 'text-primary' },
          { label: 'Volunteers', value: data.volunteers, icon: Users, tone: 'text-secondary' },
        ].map((block) => (
          <GlassCard key={block.label} className="metric-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="command-label">{block.label}</p>
                <p className="mt-5 text-4xl font-semibold text-text-strong">
                  <AnimatedCounter value={block.value} format={(value) => value.toLocaleString()} />
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 ${block.tone}`}>
                <block.icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <GlassCard className="p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="command-label">Nearby Shelters</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-strong">Shelter and hazard monitoring</h2>
            </div>
            <StatusBadge label="Live Map" variant="primary" />
          </div>
          <div className="mt-8 rounded-[1.75rem] border border-border-subtle bg-surface/72 p-6 shadow-inset">
            <div className="relative h-[400px] overflow-hidden rounded-[1.5rem] border border-border-subtle bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.14),transparent_20%),linear-gradient(135deg,#081120_0%,#111827_100%)]">
              <div className="absolute left-[14%] top-[20%] h-4 w-4 rounded-full bg-danger shadow-[0_0_28px_rgba(239,68,68,0.55)] animate-pulse-gentle" />
              <div className="absolute left-[40%] top-[34%] h-4 w-4 rounded-full bg-warning shadow-[0_0_28px_rgba(245,158,11,0.55)] animate-pulse-gentle" />
              <div className="absolute right-[18%] top-[26%] h-4 w-4 rounded-full bg-primary shadow-[0_0_28px_rgba(6,182,212,0.55)] animate-pulse-gentle" />
              <div className="absolute bottom-[18%] left-[26%] h-4 w-4 rounded-full bg-secondary shadow-[0_0_28px_rgba(16,185,129,0.55)] animate-pulse-gentle" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:52px_52px]" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border-subtle bg-background/70 px-5 py-4 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-semibold text-text-strong">Grid sectors synchronized</p>
                  <p className="mt-1 text-sm text-text-dim">Maps, shelters, and alert vectors are currently mirrored.</p>
                </div>
                <StatusBadge label="Tracking" variant="secondary" />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-8">
            <div>
              <p className="command-label">Disaster Status Widgets</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-strong">Resident safety overview</h2>
            </div>
            <div className="mt-7 space-y-4">
              {[
                { label: 'Safe', count: safety.safe, tone: 'bg-primary text-slate-950' },
                { label: 'Need Assistance', count: safety.needAssistance, tone: 'bg-warning text-slate-950' },
                { label: 'Emergency', count: safety.emergency, tone: 'bg-danger text-white' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-border-subtle bg-surface/70 p-5 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-muted">{item.label}</p>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.tone}`}>{item.count}</span>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-backgroundAlt">
                    <div
                      className={`h-full rounded-full ${
                        item.label === 'Safe'
                          ? 'bg-gradient-to-r from-primary to-secondary'
                          : item.label === 'Need Assistance'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                      style={{ width: `${Math.min(item.count, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="command-label">Emergency Contacts</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-strong">Escalation readiness</h2>
              </div>
              <StatusBadge label="Tier 1" variant="danger" />
            </div>
            <div className="mt-6 space-y-4">
              {[
                { name: 'Society Admin Control', role: 'Primary commander', phone: '+91 98765 00001' },
                { name: 'Medical Response Unit', role: 'Ambulance dispatch', phone: '+91 98765 00002' },
                { name: 'Shelter Coordination Desk', role: 'Shelter routing', phone: '+91 98765 00003' },
              ].map((contact) => (
                <div key={contact.name} className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-4 transition hover:border-border-active">
                  <p className="text-sm font-semibold text-text-strong">{contact.name}</p>
                  <p className="mt-1 text-sm text-text-dim">{contact.role}</p>
                  <p className="mt-3 text-sm font-medium text-primary">{contact.phone}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <FloatingActionButton
        label="Log Incident"
        onClick={() => setToast({ message: 'Incident log workflow is ready', variant: 'info' })}
        icon={<Plus size={16} />}
      />
    </div>
  );
}

export default DisasterDashboard;
