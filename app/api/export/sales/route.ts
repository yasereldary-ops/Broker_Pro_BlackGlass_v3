import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const rows = await prisma.sale.findMany({ include: { user:true, client:true, property:true, commission:true } });
  const header = ['id','date','amount','user','client','property','commission_amount','commission_rate'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([r.id, r.date.toISOString(), r.amount, r.user?.email||'', r.client?.name||'', r.property?.name||'', r.commission?.amount||'', r.commission?.rate||''].map(String).map(s=>`"${s.replace(/"/g,'""')}"`).join(','));
  }
  const csv = lines.join('\n');
  return new Response(csv, { status:200, headers: { 'Content-Type':'text/csv','Content-Disposition':'attachment; filename="sales.csv"' } });
}
