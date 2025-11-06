import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionUser } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST() {
  const session = await getIronSession<{ user?: SessionUser }>(await cookies(), sessionOptions);
  await session.destroy();
  return NextResponse.json({ ok: true });
}
