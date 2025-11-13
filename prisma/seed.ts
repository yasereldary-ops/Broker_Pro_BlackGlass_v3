import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const pw = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.create({ data: { name: "Admin", email: "admin@broker.local", role: "admin", password: pw } });
  const leader = await prisma.user.create({ data: { name: "Leader", email: "leader@broker.local", role: "team_leader", password: pw } });
  const cons = await prisma.user.create({ data: { name: "Consultant", email: "consultant@broker.local", role: "consultant", password: pw } });
  const c1 = await prisma.client.create({ data: { name: "Client A", phone: "0100000001", email: "a@client.com" } });
  const p1 = await prisma.property.create({ data: { name: "SkyTower", developer: "DevCo", price: 10000000, commission: 2.5 } });
  const s1 = await prisma.sale.create({ data: { amount: 5000000, userId: leader.id, clientId: c1.id, propertyId: p1.id } });
  await prisma.commission.create({ data: { rate: 0.0075, amount: 5000000 * 0.0075, saleId: s1.id } });
  console.log("Seed finished");
}
main().catch(e => { console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect());
