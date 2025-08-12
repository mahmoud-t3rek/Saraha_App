import jwt from 'jsonwebtoken';

export const varifyToken = (token, secret) => {
  if (!token) throw new Error("Token not provided to varifyToken");
  return jwt.verify(token, secret);
};
