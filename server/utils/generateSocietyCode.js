const generateSocietyCode = (name, pincode) => {
  const prefix = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return `${prefix}-${pincode}`;
};

module.exports = generateSocietyCode;