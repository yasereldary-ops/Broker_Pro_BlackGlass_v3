import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 🟢 نجيب كل الـ sales من قاعدة البيانات
    const sales = await prisma.sale.findMany({
      include: { commission: true },
    });

    if (!sales || sales.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalSales: 0,
          totalExpenses: 0,
          netProfit: 0,
          monthly: [],
        },
      });
    }

    // 🟢 تحميل إعدادات المصاريف من config.json
    let settings: any = {};
    if (fs.existsSync("config.json")) {
      settings = JSON.parse(fs.readFileSync("config.json", "utf-8"));
    } else {
      settings = {
        expenses: {
          rent: 125000,
          hr: 16000,
          admin: 10000,
          officeBoy: 6000,
          utilities: 10000,
          marketing: 120000,
        },
      };
    }

    const monthlyExpenses =
      Object.values(settings.expenses).reduce((a: any, b: any) => a + b, 0) || 287000;

    // 🟢 إنشاء بيانات الأشهر بناءً على المبيعات الفعلية
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthly = months.map((m, i) => {
      const monthSales = sales
        .filter((s) => new Date(s.date).getMonth() === i)
        .reduce((sum, s) => sum + s.amount, 0);

      const commissions = sales
        .filter((s) => new Date(s.date).getMonth() === i)
        .reduce((sum, s) => sum + (s.commission?.amount || 0), 0);

      const profit = commissions - monthlyExpenses;
      return {
        month: m,
        sales: monthSales,
        expenses: monthlyExpenses,
        profit: Math.round(profit),
      };
    });

    // 🟢 إجماليات السنة
    const totalSales = sales.reduce((s, x) => s + x.amount, 0);
    const totalCommission = sales.reduce((s, x) => s + (x.commission?.amount || 0), 0);
    const totalExpenses = monthlyExpenses * 12;
    const netProfit = totalCommission - totalExpenses;

    return NextResponse.json({
      success: true,
      data: { totalSales, totalExpenses, netProfit, monthly },
    });
  } catch (err) {
    console.error("REPORTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Error generating reports" },
      { status: 500 }
    );
  }
}
