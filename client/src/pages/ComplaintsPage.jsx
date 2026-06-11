import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import api from '../utils/api.js';

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
    location: '',
  });
  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, user]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaints?status=${statusFilter}&limit=50`);
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      setError('Failed to load complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/complaints', newComplaint);
      if (res.data.success) {
        setComplaints([res.data.complaint, ...complaints]);
        setNewComplaint({ title: '', description: '', category: 'maintenance', location: '' });
        setShowCreateForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      setError('Failed to update complaint status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400"></div>
          <p className="text-slate-400">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-[2rem] border border-rose-500/30 bg-rose-950/20 p-4 text-rose-300">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Complaints & Reports</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Track and manage resident complaints with AI-powered categorization and priority assignment.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            New Complaint
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateComplaint} className="mt-8 space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
            <input
              type="text"
              placeholder="Complaint title"
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              required
            />
            <textarea
              placeholder="Describe the issue in detail"
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none min-h-[100px]"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              >
                <option value="maintenance">Maintenance</option>
                <option value="noise">Noise</option>
                <option value="parking">Parking</option>
                <option value="water">Water/Sanitation</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Location (e.g., Building A, Apt 3)"
                value={newComplaint.location}
                onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition"
            >
              Submit Complaint
            </button>
          </form>
        )}
      </motion.div>

      {/* Filters and List */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          <div className="space-y-2">
            {['open', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`w-full text-left px-4 py-2 rounded-lg transition capitalize ${
                  statusFilter === status
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'hover:bg-slate-900/80 text-slate-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <motion.div
                key={complaint._id}
                onClick={() => setSelectedComplaint(complaint)}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-lg border transition cursor-pointer ${
                  selectedComplaint?._id === complaint._id
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{complaint.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{complaint.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      complaint.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300'
                        : complaint.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {complaint.priority}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No complaints found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail View */}
      {selectedComplaint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">{selectedComplaint.title}</h2>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Description</p>
                <p className="mt-2 text-slate-300">{selectedComplaint.description}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
                <p className="mt-1 text-slate-300">{selectedComplaint.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Status</p>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => handleUpdateStatus(selectedComplaint._id, e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Priority</p>
                <p className="mt-1 text-slate-300 capitalize">{selectedComplaint.priority}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ComplaintsPage;
