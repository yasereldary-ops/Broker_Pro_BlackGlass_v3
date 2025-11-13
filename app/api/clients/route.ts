import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        sales: {
          include: {
            property: { select: { name: true } },
            commission: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Error fetching clients" },
      { status: 500 }
    );
  }
}
