import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { fmtMoney, fmtDate } from "@/lib/format";
import Header from "@/components/Header";

async function getData(userId: string) {
  const [ins, outs, rows] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: "IN" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "OUT" }, _sum: { amount: true } }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 50 }),
  ]);
  const saldo = Number(ins._sum.amount ?? 0) - Number(outs._sum.amount ?? 0);
  return { saldo, rows: rows.map((r) => ({ ...r, amount: Number(r.amount) })) };
}

export default async function MovimientosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { saldo, rows } = await getData(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d32f2f] mb-2">
            Movimientos
          </h1>
        </div>

        <section className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">Saldo actual</p>
          </div>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-2 text-gray-900">{fmtMoney(saldo)}</p>
        </section>

        <section className="grid gap-4 sm:gap-6">
          {rows.length === 0 && (
            <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                Aún no hay movimientos.
              </p>
              <a 
                href="/agregar" 
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar uno
              </a>
            </div>
          )}
          {rows.map((m) => (
            <article 
              key={m.id} 
              className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {m.type === "IN" ? "Ingreso" : "Egreso"}
                  </p>
                </div>
                <p className="text-base sm:text-lg text-gray-600 truncate">
                  {fmtDate(m.date)}{m.note ? ` — ${m.note}` : ""}
                </p>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold flex-shrink-0 ${m.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                {m.type === "IN" ? "+" : "−"} {fmtMoney(m.amount)}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
