import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { fmtMoney, fmtDate } from "@/lib/format";
import Header from "@/components/Header";

async function getSaldo(userId: string) {
  const [ins, outs] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: "IN" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "OUT" }, _sum: { amount: true } }),
  ]);
  return Number(ins._sum.amount ?? 0) - Number(outs._sum.amount ?? 0);
}

async function getMovimientos(userId: string, page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where: { userId } }),
  ]);
  return {
    rows: rows.map((r) => ({ ...r, amount: Number(r.amount) })),
    total,
    pages: Math.ceil(total / pageSize),
  };
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const saldo = await getSaldo(user.id);
  const page = Number(searchParams.page ?? "1");
  const { rows, total, pages } = await getMovimientos(user.id, page, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#d32f2f] to-[#ff6f00] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d32f2f] mb-2">
            Tu efectivo
          </h1>
        </div>

        <section className="grid gap-6 sm:gap-8">
          <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">Saldo actual</p>
            </div>
            <p className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-3 mb-2 text-gray-900">{fmtMoney(saldo)}</p>
            <p className="text-sm sm:text-base text-gray-500">Actualizado ahora</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link 
              href="/agregar" 
              className="flex-1 text-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-4 sm:py-5 text-xl sm:text-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar movimiento
            </Link>
            <Link 
              href="/movimientos" 
              className="flex-1 text-center rounded-2xl border-2 border-gray-300 hover:border-[#d32f2f] bg-white hover:bg-red-50 py-4 sm:py-5 text-xl sm:text-2xl font-bold text-gray-900 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ver historial
            </Link>
          </div>

          {/* Historial de movimientos */}
          {total > 0 && (
            <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Movimientos recientes</h2>
                </div>
                {total > 10 && (
                  <span className="text-sm sm:text-base text-gray-500">
                    {total} total
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:gap-4 mb-6">
                {rows.map((m) => (
                  <article 
                    key={m.id} 
                    className="rounded-2xl border-2 border-gray-200 bg-gray-50 shadow-md p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {m.type === "IN" ? (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        )}
                        <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                          {m.type === "IN" ? "Ingreso" : "Egreso"}
                        </p>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        {fmtDate(m.date)}{m.note ? ` — ${m.note}` : ""}
                      </p>
                    </div>
                    <p className={`text-xl sm:text-2xl font-bold flex-shrink-0 ${m.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                      {m.type === "IN" ? "+" : "−"} {fmtMoney(m.amount)}
                    </p>
                  </article>
                ))}
              </div>

              {/* Paginación */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 border-t border-gray-200">
                  {page > 1 && (
                    <Link
                      href={`/?page=${page - 1}`}
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2 border-gray-300 hover:border-[#d32f2f] bg-white hover:bg-red-50 text-gray-900 font-semibold transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Anterior</span>
                    </Link>
                  )}
                  <span className="text-sm sm:text-base text-gray-600 px-4">
                    Página {page} de {pages}
                  </span>
                  {page < pages && (
                    <Link
                      href={`/?page=${page + 1}`}
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2 border-gray-300 hover:border-[#d32f2f] bg-white hover:bg-red-50 text-gray-900 font-semibold transition-all flex items-center gap-2"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
