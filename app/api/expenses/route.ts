import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: expenses });
  } catch (err) {
    console.error("EXPENSES GET ERROR:", err);
    return NextResponse.json({ success: false, message: "Error fetching expenses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expense = await prisma.expense.create({
      data: { name: body.name, amount: parseFloat(body.amount) },
    });
    return NextResponse.json({ success: true, data: expense });
  } catch (err) {
    console.error("EXPENSES POST ERROR:", err);
    return NextResponse.json({ success: false, message: "Error adding expense" }, { status: 500 });
  }
}
