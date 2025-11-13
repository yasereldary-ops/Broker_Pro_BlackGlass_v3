import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
