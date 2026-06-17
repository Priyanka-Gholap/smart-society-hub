// server/utils/validateInput.js
export const validateRegister = (data) => {
  const errors = {};

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  }
  
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.phone || !/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
    errors.phone = 'Valid 10-digit phone number is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateCreateSociety = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Society name is required';
  }

  if (!data.societyType || !['apartment_complex', 'gated_community', 'housing_society', 'residential_association'].includes(data.societyType)) {
    errors.societyType = 'Valid society type is required';
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Address is required';
  }

  if (!data.city || data.city.trim().length === 0) {
    errors.city = 'City is required';
  }

  if (!data.state || data.state.trim().length === 0) {
    errors.state = 'State is required';
  }

  if (!data.pincode || !/^\d{6}$/.test(data.pincode)) {
    errors.pincode = 'Valid 6-digit pincode is required';
  }

  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Valid latitude is required (-90 to 90)';
  }

  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Valid longitude is required (-180 to 180)';
  }

  if (!Number.isInteger(data.numberOfBuildings) || data.numberOfBuildings < 1) {
    errors.numberOfBuildings = 'Number of buildings must be at least 1';
  }

  if (!Number.isInteger(data.numberOfFlats) || data.numberOfFlats < 1) {
    errors.numberOfFlats = 'Number of flats must be at least 1';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateJoinSociety = (data) => {
  const errors = {};

  if (!data.societyCode || data.societyCode.trim().length === 0) {
    errors.societyCode = 'Society code is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
