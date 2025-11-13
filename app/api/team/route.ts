import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 🟢 نجيب المستخدمين اللى عندهم مبيعات فعلًا
    const users = await prisma.user.findMany({
      include: {
        sales: {
          include: {
            commission: true,
          },
        },
      },
    });

    // لو مافيش بيانات نرجع مصفوفة فاضية بدل Error
    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    console.error("TEAM API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching team data" },
      { status: 500 }
    );
  }
}
