// app/api/sales/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET — fetch all sales with relations
export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: { select: { id: true, name: true, role: true } },
        client: { select: { id: true, name: true, phone: true } },
        property: { select: { id: true, name: true, developer: true, price: true } },
        commission: true,
      },
      orderBy: { date: "desc" },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalCommission = sales.reduce(
      (sum, s) => sum + (s.commission?.amount ?? 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: sales,
      kpis: {
        totalSales,
        totalCommission,
        dealsCount: sales.length,
      },
    });
  } catch (err) {
    console.error("Error fetching sales:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching sales data" },
      { status: 500 }
    );
  }
}

// POST — add a new sale (optional)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, userId, clientId, propertyId, commissionRate } = body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    const commissionAmount = amount * (commissionRate ?? 0.0075);

    const sale = await prisma.sale.create({
      data: {
        amount,
        userId,
        clientId,
        propertyId,
        commission: {
          create: {
            rate: commissionRate ?? 0.0075,
            amount: commissionAmount,
          },
        },
      },
      include: {
        user: true,
        client: true,
        property: true,
        commission: true,
      },
    });

    return NextResponse.json({ success: true, sale });
  } catch (err: any) {
    console.error("Error creating sale:", err);
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to create sale" },
      { status: 500 }
    );
  }
}
