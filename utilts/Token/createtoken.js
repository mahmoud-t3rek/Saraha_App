import jwt from "jsonwebtoken"

export const createToken = async (payload = {}, secret, options = {}) => {
  if (!secret) {
    throw new Error("Secret key is missing", { cause: 409 });
  }
  return jwt.sign(payload, secret, options);
};
