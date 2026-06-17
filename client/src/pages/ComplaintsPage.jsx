import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Filter, ClipboardList, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import StatusBadge from '../components/common/StatusBadge.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    location: {
      description: '',
    },
  });
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/complaints?status=${statusFilter}&limit=50`);
        if (response.data.success) {
          setComplaints(response.data.complaints || []);
        }
      } catch (requestError) {
        setError('Failed to load complaints');
        console.error(requestError);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [statusFilter, user]);

  const handleCreateComplaint = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/complaints', newComplaint);
      if (response.data.success) {
        setComplaints([response.data.complaint, ...complaints]);
        setNewComplaint({
          title: '',
          description: '',
          category: 'maintenance',
          location: {
            description: '',
          },
        });
        setShowCreateForm(false);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to create complaint');
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
      const response = await api.get(`/complaints?status=${statusFilter}&limit=50`);
      if (response.data.success) {
        setComplaints(response.data.complaints || []);
      }
      setSelectedComplaint(null);
    } catch (requestError) {
      setError('Failed to update complaint status');
      console.error(requestError);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surfaceAlt border-t-primary"></div>
          <p className="text-text-dim">Loading complaints...</p>
        </div>
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_26%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="command-label text-primary">Complaint Tracking</p>
            <h1 className="mt-2 text-3xl font-semibold text-text-strong">Resident issues and response workflow</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
              Track incoming complaints, prioritize by urgency, and move issues through verification and resolution with a modern command-center workflow.
            </p>
          </div>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            New Complaint
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateComplaint} className="mt-8 space-y-4 rounded-[1.7rem] border border-border-subtle bg-surface/72 p-6 shadow-inset">
            <input
              type="text"
              placeholder="Complaint title"
              value={newComplaint.title}
              onChange={(event) => setNewComplaint({ ...newComplaint, title: event.target.value })}
              className="command-input"
              required
            />
            <textarea
              placeholder="Describe the issue in detail"
              value={newComplaint.description}
              onChange={(event) => setNewComplaint({ ...newComplaint, description: event.target.value })}
              className="command-input min-h-[120px] py-3"
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                value={newComplaint.category}
                onChange={(event) => setNewComplaint({ ...newComplaint, category: event.target.value })}
                className="command-input"
              >
                <option value="maintenance">Maintenance</option>
                <option value="noise">Noise</option>
                <option value="parking">Parking</option>
                <option value="plumbing">Water/Sanitation</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Location (e.g., Building A, Apt 3)"
                value={newComplaint.location.description}
                onChange={(event) =>
                  setNewComplaint({
                    ...newComplaint,
                    location: {
                      ...newComplaint.location,
                      description: event.target.value,
                    },
                  })
                }
                className="command-input"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Submit Complaint
            </button>
          </form>
        )}
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border-subtle bg-surface/80 text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <p className="command-label">Filters</p>
              <h3 className="mt-1 text-lg font-semibold text-text-strong">Complaint State</h3>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {['pending', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`w-full rounded-[1.3rem] border px-4 py-3 text-left capitalize transition ${
                  statusFilter === status
                    ? 'border-primary/20 bg-primary/12 text-primary shadow-glow'
                    : 'border-transparent bg-surface/60 text-text-muted hover:border-border-subtle hover:bg-surface/82 hover:text-text-strong'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Pending', value: complaints.filter((item) => item.status === 'pending').length, icon: ClipboardList },
              { label: 'In Progress', value: complaints.filter((item) => item.status === 'in_progress').length, icon: AlertCircle },
              { label: 'Resolved', value: complaints.filter((item) => item.status === 'resolved').length, icon: ClipboardList },
            ].map((card) => (
              <div key={card.label} className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                <div className="flex items-center justify-between gap-3">
                  <p className="command-label">{card.label}</p>
                  <card.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-5 text-3xl font-semibold text-text-strong">{card.value}</p>
              </div>
            ))}
          </div>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="command-label">Complaint Tracking Cards</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-strong">Issue queue</h2>
              </div>
              <StatusBadge label={`${complaints.length} visible`} variant="secondary" />
            </div>

            <div className="mt-6 space-y-3">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <motion.div
                    key={complaint._id}
                    onClick={() => setSelectedComplaint(complaint)}
                    whileHover={{ x: 4 }}
                    className={`cursor-pointer rounded-[1.5rem] border p-5 transition ${
                      selectedComplaint?._id === complaint._id
                        ? 'border-primary/20 bg-primary/10 shadow-glow'
                        : 'border-border-subtle bg-surface/68 hover:border-border-active hover:bg-surface/82'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-text-strong">{complaint.title}</p>
                        <p className="mt-2 text-sm text-text-dim">{complaint.location?.description || 'No location provided'}</p>
                      </div>
                      <StatusBadge
                        label={complaint.priority}
                        variant={
                          complaint.priority === 'high' || complaint.priority === 'critical'
                            ? 'danger'
                            : complaint.priority === 'medium'
                            ? 'warning'
                            : 'primary'
                        }
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-border-subtle bg-surface/68 p-6 text-sm text-text-dim">
                  No complaints found.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {selectedComplaint && (
        <GlassCard className="p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="command-label">Complaint Detail</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-strong">{selectedComplaint.title}</h2>
            </div>
            <button onClick={() => setSelectedComplaint(null)} className="btn-secondary px-4">
              Close
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                <p className="command-label">Description</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">{selectedComplaint.description}</p>
              </div>
              <div className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                <p className="command-label">Location</p>
                <p className="mt-3 text-sm text-text-muted">{selectedComplaint.location?.description || 'No location provided'}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                <p className="command-label">Status</p>
                <select
                  value={selectedComplaint.status}
                  onChange={(event) => handleUpdateStatus(selectedComplaint._id, event.target.value)}
                  className="command-input mt-3"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                <p className="command-label">Priority</p>
                <p className="mt-3 text-sm font-semibold capitalize text-text-strong">{selectedComplaint.priority}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default ComplaintsPage;
