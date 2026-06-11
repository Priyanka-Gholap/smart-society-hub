import jwt from 'jsonwebtoken';

export const generateToken = (userId, role, societyId = null) => {
  const token = jwt.sign(
    {
      userId,
      role,
      societyId,
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );

  return token;
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
    );
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};