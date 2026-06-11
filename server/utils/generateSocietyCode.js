export const generateSocietyCode = (name, pincode) => {
  // Get first 3 letters of society name
  const namePrefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, 'A');

  // Get random 3 digits
  const randomDigits = Math.floor(Math.random() * 900) + 100;

  // Get last 2 digits of pincode
  const pincodePrefix = pincode.slice(-2).toUpperCase();

  return `${namePrefix}${randomDigits}${pincodePrefix}`;
};

export const validateSocietyCode = (code) => {
  // Society code format: 3 letters + 3 digits + 2 alphanumeric = 8 characters
  return /^[A-Z]{3}\d{3}[A-Z0-9]{2}$/.test(code);
};