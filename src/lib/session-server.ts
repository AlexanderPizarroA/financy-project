import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionUser } from "@/lib/session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getIronSession<{ user?: SessionUser }>(await cookies(), sessionOptions);
  return session.user ?? null;
}
