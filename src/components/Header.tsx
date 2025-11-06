import Link from "next/link";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";

export default async function Header() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <header className="bg-gradient-to-r from-[#d32f2f] to-[#ff6f00] text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo y Home */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-base sm:text-xl lg:text-2xl font-bold hidden sm:inline">Financy</span>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-1 justify-end overflow-x-auto">
            <Link 
              href="/" 
              className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-xl hover:bg-white/20 transition-colors text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap flex items-center gap-1"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            <Link 
              href="/agregar" 
              className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-xl hover:bg-white/20 transition-colors text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap flex items-center gap-1"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Ingreso/Egreso</span>
              <span className="sm:hidden">+/-</span>
            </Link>
            <Link 
              href="/movimientos" 
              className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-xl hover:bg-white/20 transition-colors text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap flex items-center gap-1"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline">Movimientos</span>
              <span className="sm:hidden">Lista</span>
            </Link>
            <form action="/api/logout" method="post" className="ml-1 sm:ml-2 lg:ml-4 flex-shrink-0">
              <button 
                type="submit" 
                className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap flex items-center gap-1"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}
