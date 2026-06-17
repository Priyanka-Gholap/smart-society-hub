// server/utils/geolocation.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const radiusToMeters = (radiusKm) => {
  return radiusKm * 1000;
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Using OpenStreetMap Nominatim API (free, no key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return {
      address: data.address?.road || data.address?.street || data.address?.hamlet || '',
      city: data.address?.city || data.address?.town || '',
      state: data.address?.state || '',
      pincode: data.address?.postcode || '',
      fullAddress: data.display_name || '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};