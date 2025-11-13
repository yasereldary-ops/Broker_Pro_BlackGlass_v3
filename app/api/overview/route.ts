import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const [sales, clients, users] = await Promise.all([
      prisma.sale.findMany({ include: { commission: true } }),
      prisma.client.findMany(),
      prisma.user.findMany(),
    ]);

    const totalSales = sales.reduce((s, x) => s + x.amount, 0);
    const totalCommission = sales.reduce((s, x) => s + (x.commission?.amount || 0), 0);
    const totalClients = clients.length;
    const activeTeam = users.length;
    const expenses = 287000; // يمكن لاحقًا ناخدها من جدول مصروفات
    const netProfit = totalSales * 0.0075 - expenses;

    const monthlyGrowth = [
      { month: "Jul", sales: 5_000_000, profit: 250_000 },
      { month: "Aug", sales: 7_200_000, profit: 380_000 },
      { month: "Sep", sales: 10_500_000, profit: 500_000 },
      { month: "Oct", sales: 15_000_000, profit: 720_000 },
      { month: "Nov", sales: totalSales, profit: netProfit },
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalSales,
        totalCommission,
        totalClients,
        activeTeam,
        netProfit,
        monthlyGrowth,
      },
    });
  } catch (err) {
    console.error("OVERVIEW ERROR:", err);
    return NextResponse.json({ success: false, message: "Error fetching overview" }, { status: 500 });
  }
}
