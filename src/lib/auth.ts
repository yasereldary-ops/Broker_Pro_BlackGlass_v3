import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
const SECRET = process.env.JWT_SECRET || 'changeit';
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}
export function verifyToken(token: string) {
  try { return jwt.verify(token, SECRET); } catch(e) { return null; }
}
export function getTokenFromHeader(req: NextRequest) {
  const h = req.headers.get('authorization') || '';
  if (h.startsWith('Bearer ')) return h.slice(7);
  return null;
}
