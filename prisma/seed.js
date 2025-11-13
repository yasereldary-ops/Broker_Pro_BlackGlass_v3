// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seeding...");

  // 1️⃣ Users
  const users = await prisma.user.createMany({
    data: [
      { name: "Ahmed Khaled", email: "ahmed@broker.com", role: "admin", password: "123456" },
      { name: "Mina Nabil", email: "mina@broker.com", role: "consultant", password: "123456" },
      { name: "Sara Adel", email: "sara@broker.com", role: "consultant", password: "123456" },
    ],
  });
  console.log(`✅ Users added: ${users.count}`);

  // 2️⃣ Clients
  const clients = await prisma.client.createMany({
    data: [
      { name: "Mohamed Ali", phone: "01001234567", email: "mohamed@example.com" },
      { name: "Hany Fathy", phone: "01122334455", email: "hany@example.com" },
      { name: "Laila Hassan", phone: "01234567890", email: "laila@example.com" },
    ],
  });
  console.log(`✅ Clients added: ${clients.count}`);

  // 3️⃣ Properties
  const properties = await prisma.property.createMany({
    data: [
      { name: "Palm Hills New Cairo", developer: "Palm Hills", price: 6_000_000, commission: 0.008 },
      { name: "Mountain View iCity", developer: "DMG", price: 5_200_000, commission: 0.007 },
      { name: "ZED Towers", developer: "Ora Developers", price: 8_500_000, commission: 0.01 },
    ],
  });
  console.log(`✅ Properties added: ${properties.count}`);

  // 4️⃣ Sales (linked to users/clients/properties)
  const [user1, user2, user3] = await prisma.user.findMany();
  const [client1, client2, client3] = await prisma.client.findMany();
  const [prop1, prop2, prop3] = await prisma.property.findMany();

  const sale1 = await prisma.sale.create({
    data: {
      amount: 6_000_000,
      userId: user1.id,
      clientId: client1.id,
      propertyId: prop1.id,
      commission: { create: { rate: 0.008, amount: 48_000 } },
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      amount: 5_200_000,
      userId: user2.id,
      clientId: client2.id,
      propertyId: prop2.id,
      commission: { create: { rate: 0.007, amount: 36_400 } },
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      amount: 8_500_000,
      userId: user3.id,
      clientId: client3.id,
      propertyId: prop3.id,
      commission: { create: { rate: 0.01, amount: 85_000 } },
    },
  });

  console.log("✅ Sales added:", [sale1.id, sale2.id, sale3.id]);

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
