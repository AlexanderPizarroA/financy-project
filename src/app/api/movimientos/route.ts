import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session-server";
import { Prisma } from "@prisma/client";

const createSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  amount: z.number().positive(),
  category: z.string().max(50).optional().nullable(),
  note: z.string().max(200).optional().nullable(),
});

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ msg: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Math.min(Number(searchParams.get("pageSize") ?? "50"), 100);

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where: { userId: user.id } }),
  ]);

  type TransactionRow = Prisma.TransactionGetPayload<{}>;
  
  return NextResponse.json({
    data: rows.map((r: TransactionRow) => ({ ...r, amount: Number(r.amount) })),
    page,
    pageSize,
    total,
    pages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ msg: "No autorizado" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse({
    ...json,
    amount: typeof json.amount === "string" ? Number(json.amount) : json.amount,
  });
  if (!parsed.success) {
    return NextResponse.json({ msg: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
  }

  const { type, amount, category, note } = parsed.data;

  // Usar fecha y hora actual automáticamente
  const row = await prisma.transaction.create({
    data: {
      userId: user.id,
      type,
      amount,
      date: new Date(), // Siempre usar fecha y hora actual
      category: category ?? null,
      note: note ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: row.id });
}

