import Link from "next/link";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";

export default async function Header() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <header className="bg-gradient-to-r from-[#d32f2f] to-[#ff6f00] text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo y Home */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold">Financy</span>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/" 
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/agregar" 
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium"
            >
              Agregar
            </Link>
            <Link 
              href="/movimientos" 
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-white/20 transition-colors text-sm sm:text-base font-medium"
            >
              Movimientos
            </Link>
            <form action="/api/logout" method="post" className="ml-2 sm:ml-4">
              <button 
                type="submit" 
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm sm:text-base font-medium"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}

