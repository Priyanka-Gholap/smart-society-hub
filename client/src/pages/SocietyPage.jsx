import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import api from '../utils/api.js';

function SocietyPage() {
  const { user } = useAuth();
  const [currentSociety, setCurrentSociety] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    societyType: 'residential',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    numberOfBuildings: '',
    numberOfFlats: '',
    description: '',
    contactPerson: '',
  });

  useEffect(() => {
    fetchSocietyData();
  }, [user]);

  const fetchSocietyData = async () => {
    try {
      setLoading(true);
      
      // Get current user's society if exists
      if (user?.society) {
        const res = await api.get(`/societies/${user.society}`);
        if (res.data.success) {
          setCurrentSociety(res.data.society);
        }
      }

      // Get available societies
      const societiesRes = await api.get('/societies/?limit=10');
      if (societiesRes.data.success) {
        setSocieties(societiesRes.data.societies || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch society data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSociety = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/societies/create', createForm);
      if (res.data.success) {
        setCurrentSociety(res.data.society);
        setShowCreateForm(false);
        setError('');
        alert(`Society created! Code: ${res.data.societyCode}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create society');
    }
  };

  const handleJoinSociety = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/societies/join', { societyCode: joinCode });
      if (res.data.success) {
        setCurrentSociety(res.data.society);
        setShowJoinForm(false);
        setJoinCode('');
        setError('');
        alert('Successfully joined society!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join society');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400"></div>
          <p className="text-slate-400">Loading society data...</p>
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

      {/* Current Society Info */}
      {currentSociety && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-cyan-500/30 bg-cyan-950/20 p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Current Society</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{currentSociety.name}</h2>
              <p className="mt-2 text-slate-400">{currentSociety.address}, {currentSociety.city}</p>
              <p className="mt-1 text-sm text-slate-500">Code: {currentSociety.societyCode}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-cyan-300">{currentSociety.members?.length || 0}</p>
              <p className="text-sm text-slate-400">members</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create/Join Forms */}
      {!currentSociety && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Create Society Form */}
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8">
            <h3 className="text-xl font-semibold text-white">Create new society</h3>
            <form onSubmit={handleCreateSociety} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Society name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={createForm.pincode}
                  onChange={(e) => setCreateForm({ ...createForm, pincode: e.target.value })}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition"
              >
                Create Society
              </button>
            </form>
          </div>

          {/* Join Society Form */}
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8">
            <h3 className="text-xl font-semibold text-white">Join existing society</h3>
            <form onSubmit={handleJoinSociety} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Enter society code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none text-center text-lg tracking-widest"
                required
              />
              <p className="text-xs text-slate-500 text-center">Ask your society admin for the code</p>
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition"
              >
                Join Society
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Available Societies */}
      {!currentSociety && societies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8"
        >
          <h3 className="text-xl font-semibold text-white">Available societies</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {societies.map((society) => (
              <div key={society._id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <h4 className="font-semibold text-cyan-300">{society.name}</h4>
                <p className="text-sm text-slate-400">{society.city}</p>
                <p className="mt-2 text-xs text-slate-500">{society.members?.length || 0} members</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Society Details Card */}
      {currentSociety && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8"
        >
          <h2 className="text-2xl font-semibold text-white">Management</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {[
              { title: 'Notice board', text: 'Pinned announcements, community updates, and upcoming events.' },
              { title: 'Complaints', text: 'Track resident reports and assign tasks to maintenance teams.' },
              { title: 'Residents', text: 'Browse resident directory, contact details, and safety statuses.' },
              { title: 'Events', text: 'Plan community gatherings and monitor attendance.' },
            ].map((card) => (
              <div key={card.title} className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 text-slate-200">
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{card.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SocietyPage;
