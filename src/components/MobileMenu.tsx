"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Botón hamburguesa (a la derecha en móvil) */}
      <button
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 px-3 py-2 text-white sm:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] sm:hidden z-[60]"
        />
      )}

      {/* Drawer DESDE LA DERECHA */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[82%] max-w-[320px]
          bg-white text-gray-800 shadow-2xl z-[70] sm:hidden
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 flex items-center justify-between border-b">
          <span className="text-lg font-semibold">Menú</span>
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <Link href="/" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100">
            <svg className="w-6 h-6 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="text-base font-medium">Inicio</span>
          </Link>

          <Link href="/agregar" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-base font-medium">Ingreso/Egreso</span>
          </Link>

          <Link href="/movimientos" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span className="text-base font-medium">Movimientos</span>
          </Link>

          <form action="/api/logout" method="post" className="pt-2">
            <button type="submit" onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span className="text-base font-medium">Salir</span>
            </button>
          </form>
        </nav>
      </aside>
    </>
  );
}
