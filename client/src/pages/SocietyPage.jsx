import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import StatusBadge from '../components/common/StatusBadge.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

function SocietyPage() {
  const { user, setUser, refreshProfile } = useAuth();
  const societyId =
    typeof user?.society === 'object' ? user?.society?._id || user?.society?.id : user?.society;
  const [currentSociety, setCurrentSociety] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    societyType: 'housing_society',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    numberOfBuildings: '',
    numberOfFlats: '',
    description: '',
  });

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        setLoading(true);
        setError('');

        const requests = [api.get('/societies/search')];
        if (societyId) {
          requests.unshift(api.get('/societies/my-society'));
        }

        const responses = await Promise.all(requests);
        const currentSocietyResponse = societyId ? responses[0] : null;
        const societiesResponse = societyId ? responses[1] : responses[0];

        if (currentSocietyResponse?.data.success) {
          setCurrentSociety(currentSocietyResponse.data.society);
        } else {
          setCurrentSociety(null);
        }

        if (societiesResponse.data.success) {
          setSocieties(societiesResponse.data.societies || []);
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to fetch society data');
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyData();
  }, [societyId]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCreateForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setError('Please allow location access to autofill society coordinates.');
      }
    );
  };

  const syncUserProfile = async (fallbackUser) => {
    const refreshed = await refreshProfile();
    if (!refreshed.success && fallbackUser) {
      setUser(fallbackUser);
    }
  };

  const handleCreateSociety = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/societies/create', createForm);
      if (response.data.success) {
        setCurrentSociety(response.data.society);
        setShowCreateForm(false);
        setError('');
        await syncUserProfile({
          ...user,
          role: 'society_admin',
          society: response.data.society,
        });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to create society');
    }
  };

  const handleJoinSociety = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/societies/join', { societyCode: joinCode });
      if (response.data.success) {
        setCurrentSociety(response.data.society);
        setJoinCode('');
        setShowJoinForm(false);
        setError('');
        await syncUserProfile(response.data.user);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to join society');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surfaceAlt border-t-primary"></div>
          <p className="text-text-dim">Loading society data...</p>
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

      {currentSociety ? (
        <GlassCard className="overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_30%)]" />
          <div className="relative">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="command-label text-primary">Society Management</p>
                <h1 className="mt-2 text-3xl font-semibold text-text-strong">{currentSociety.name}</h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="h-4 w-4 text-primary" />
                  {currentSociety.address}, {currentSociety.city}, {currentSociety.state}
                </p>
              </div>
              <StatusBadge label={currentSociety.isVerified ? 'Verified' : 'Pending Review'} variant={currentSociety.isVerified ? 'success' : 'warning'} />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Society Code', value: currentSociety.societyCode, icon: ShieldCheck },
                { label: 'Buildings', value: currentSociety.numberOfBuildings || '-', icon: Building2 },
                { label: 'Flats', value: currentSociety.numberOfFlats || '-', icon: Users },
                { label: 'City', value: currentSociety.city || '-', icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="command-label">{item.label}</p>
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-5 text-xl font-semibold text-text-strong">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="command-label text-primary">Society Management</p>
              <h1 className="mt-2 text-3xl font-semibold text-text-strong">Create or join your society network</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                Register a new residential command node or connect to an existing community using a verified society code.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm((value) => !value);
                  setShowJoinForm(false);
                }}
                className="btn-primary"
              >
                Create Society
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowJoinForm((value) => !value);
                  setShowCreateForm(false);
                }}
                className="btn-secondary"
              >
                Join Society
              </button>
            </div>
          </div>

          {showJoinForm && (
            <form onSubmit={handleJoinSociety} className="mt-8 space-y-4 rounded-[1.7rem] border border-border-subtle bg-surface/72 p-6 shadow-inset">
              <input
                type="text"
                placeholder="Enter society code"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                className="command-input"
                required
              />
              <button type="submit" className="btn-primary w-full">
                Join Society
              </button>
            </form>
          )}

          {showCreateForm && (
            <form onSubmit={handleCreateSociety} className="mt-8 space-y-4 rounded-[1.7rem] border border-border-subtle bg-surface/72 p-6 shadow-inset">
              <input
                type="text"
                placeholder="Society Name"
                value={createForm.name}
                onChange={(event) => setCreateForm({ ...createForm, name: event.target.value })}
                className="command-input"
                required
              />
              <select
                value={createForm.societyType}
                onChange={(event) => setCreateForm({ ...createForm, societyType: event.target.value })}
                className="command-input"
              >
                <option value="housing_society">Housing Society</option>
                <option value="apartment_complex">Apartment Complex</option>
                <option value="gated_community">Gated Community</option>
                <option value="residential_association">Residential Association</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                value={createForm.address}
                onChange={(event) => setCreateForm({ ...createForm, address: event.target.value })}
                className="command-input"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="City"
                  value={createForm.city}
                  onChange={(event) => setCreateForm({ ...createForm, city: event.target.value })}
                  className="command-input"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={createForm.state}
                  onChange={(event) => setCreateForm({ ...createForm, state: event.target.value })}
                  className="command-input"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={createForm.pincode}
                  onChange={(event) => setCreateForm({ ...createForm, pincode: event.target.value })}
                  className="command-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Buildings"
                  value={createForm.numberOfBuildings}
                  onChange={(event) => setCreateForm({ ...createForm, numberOfBuildings: event.target.value })}
                  className="command-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Flats"
                  value={createForm.numberOfFlats}
                  onChange={(event) => setCreateForm({ ...createForm, numberOfFlats: event.target.value })}
                  className="command-input"
                  required
                />
              </div>
              <textarea
                placeholder="Society description"
                rows="4"
                value={createForm.description}
                onChange={(event) => setCreateForm({ ...createForm, description: event.target.value })}
                className="command-input min-h-[120px] py-3"
              />
              <button type="button" onClick={getCurrentLocation} className="btn-secondary w-full">
                Use Current Location
              </button>
              {createForm.latitude && createForm.longitude && (
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-text-base">
                  <p className="font-semibold text-text-strong">Location captured</p>
                  <p className="mt-2">Latitude: {createForm.latitude}</p>
                  <p>Longitude: {createForm.longitude}</p>
                </div>
              )}
              <button type="submit" className="btn-primary w-full">
                Create Society
              </button>
            </form>
          )}
        </GlassCard>
      )}

      <GlassCard className="p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="command-label">Location-Based Services</p>
            <h2 className="mt-2 text-2xl font-semibold text-text-strong">Nearby and approved societies</h2>
          </div>
          <StatusBadge label={`${societies.length} listed`} variant="secondary" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {societies.map((society) => (
            <motion.div
              key={society._id}
              whileHover={{ y: -4 }}
              className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 shadow-inset transition hover:border-border-active"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-text-strong">{society.name}</p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {society.address}, {society.city}, {society.state}
                  </p>
                </div>
                <StatusBadge label={society.societyCode} variant="primary" />
              </div>
            </motion.div>
          ))}
          {societies.length === 0 && (
            <p className="rounded-[1.6rem] border border-border-subtle bg-surface/72 p-5 text-text-dim">
              No approved societies available yet.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default SocietyPage;
