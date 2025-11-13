import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        sales: {
          include: { commission: true },
        },
      },
    });

    const data = users.map((u) => {
      const totalSales = u.sales.reduce((s, x) => s + x.amount, 0);
      const totalCommission = u.sales.reduce(
        (s, x) => s + (x.commission?.amount || 0),
        0
      );
      const deals = u.sales.length;
      return {
        name: u.name,
        role: u.role,
        totalSales,
        totalCommission,
        deals,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Error generating analytics" },
      { status: 500 }
    );
  }
}
