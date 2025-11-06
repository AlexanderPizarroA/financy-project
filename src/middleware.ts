import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionUser } from "@/lib/session";

const PUBLIC = ["/login", "/api/login", "/favicon.ico", "/_next", "/assets"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions);
  const user = session.user;

  if (!user) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
