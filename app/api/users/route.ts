import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const users = await prisma.user.findMany({ select: { id:true, name:true, email:true, role:true, createdAt:true } });
  return NextResponse.json(users);
}
export async function POST(req: Request) {
  const { name, email, role, password } = await req.json();
  const created = await prisma.user.create({ data: { name, email, role, password } });
  return NextResponse.json({ id: created.id });
}
