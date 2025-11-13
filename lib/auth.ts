import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
}
