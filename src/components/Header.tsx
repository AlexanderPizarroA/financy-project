import Link from "next/link";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";

export default async function Header() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <header className="bg-gradient-to-r from-[#d32f2f] to-[#ff6f00] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3 lg:py-4">
          {/* Logo + Financy */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#d32f2f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Financy
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden sm:flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Inicio</span>
            </Link>

            <Link
              href="/agregar"
              className="px-3 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Ingreso/Egreso</span>
            </Link>

            <Link
              href="/movimientos"
              className="px-3 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Movimientos</span>
            </Link>

            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm sm:text-base font-medium inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Salir</span>
              </button>
            </form>
          </nav>

          {/* Botón menú (solo móvil) */}
          <div className="sm:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
