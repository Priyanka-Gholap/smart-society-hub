import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';

function SocietyPage() {
  const auth = useAuth();
  console.log('AUTH DATA:', auth);
  const { user } = auth;
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
        const res = await api.get('/societies/my-society');
        if (res.data.success) {
          setCurrentSociety(res.data.society);
        }
      }

      // Get available societies
      const societiesRes = await api.get('/societies/search');
      if (societiesRes.data.success) {
        setSocieties(societiesRes.data.societies || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch society data');
    } finally {
      setLoading(false);
    }
  };

const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCreateForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    },
    (error) => {
      console.error(error);
      alert('Please allow location access');
    }
  );
};

  const handleCreateSociety = async (e) => {
    console.log('CREATE BUTTON CLICKED');
    e.preventDefault();
    console.log("FORM DATA:", createForm);
    try {
      console.log('CREATE FORM DATA:', createForm);
      const res = await api.post('/societies/create', createForm);
      if (res.data.success) {
        setCurrentSociety(res.data.society);
        setShowCreateForm(false);
        setError('');
        alert(`Society created! Code: ${res.data.society?.societyCode}`);
      }
    } catch (err) {
      console.log('CREATE ERROR:', err.response?.data);
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
  {/* Create Society Form */}
<div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8">
  <h3 className="text-xl font-semibold text-white">Create New Society</h3>

  <form onSubmit={handleCreateSociety} className="mt-6 space-y-4">

    {/* Society Name */}
    <input
      type="text"
      placeholder="Society Name"
      value={createForm.name}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          name: e.target.value,
        })
      }
      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
      required
    />

    {/* Society Type */}
    <select
      value={createForm.societyType}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          societyType: e.target.value,
        })
      }
      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
    >
      <option value="housing_society">Housing Society</option>
      <option value="apartment_complex">Apartment Complex</option>
      <option value="gated_community">Gated Community</option>
      <option value="residential_association">Residential Association</option>
    </select>

    {/* Address */}
    <input
      type="text"
      placeholder="Address"
      value={createForm.address}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          address: e.target.value,
        })
      }
      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
      required
    />

    {/* City + State */}
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="City"
        value={createForm.city}
        onChange={(e) =>
          setCreateForm({
            ...createForm,
            city: e.target.value,
          })
        }
        className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
        required
      />

      <input
        type="text"
        placeholder="State"
        value={createForm.state}
        onChange={(e) =>
          setCreateForm({
            ...createForm,
            state: e.target.value,
          })
        }
        className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
        required
      />
    </div>

    {/* Pincode */}
    <input
      type="text"
      placeholder="Pincode"
      value={createForm.pincode}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          pincode: e.target.value,
        })
      }
      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
      required
    />

    {/* Buildings + Flats */}
    <div className="grid grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Number Of Buildings"
        value={createForm.numberOfBuildings}
        onChange={(e) =>
          setCreateForm({
            ...createForm,
            numberOfBuildings: e.target.value,
          })
        }
        className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
        required
      />

      <input
        type="number"
        placeholder="Number Of Flats"
        value={createForm.numberOfFlats}
        onChange={(e) =>
          setCreateForm({
            ...createForm,
            numberOfFlats: e.target.value,
          })
        }
        className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
        required
      />
    </div>

    {/* Description */}
    <textarea
      placeholder="Society Description"
      rows="4"
      value={createForm.description}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          description: e.target.value,
        })
      }
      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 focus:border-cyan-400 outline-none"
    />

    {/* Location Button */}
    <button
      type="button"
      onClick={getCurrentLocation}
      className="w-full rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600 transition"
    >
      Use Current Location
    </button>

    {/* Location Display */}
    {createForm.latitude && createForm.longitude && (
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 text-sm text-cyan-300">
        📍 Location Captured
        <br />
        Latitude: {createForm.latitude}
        <br />
        Longitude: {createForm.longitude}
      </div>
    )}

    <button
      type="submit"
      className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition"
    >
      Create Society
    </button>

</form>
</div>

</div>
);
}

export default SocietyPage;
