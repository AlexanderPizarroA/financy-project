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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d32f2f] mb-2">
            Movimientos
          </h1>
        </div>

        <section className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <p className="text-lg sm:text-xl text-gray-600 font-medium">Saldo actual</p>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-2 text-gray-900">{fmtMoney(saldo)}</p>
        </section>

        <section className="grid gap-4 sm:gap-6">
          {rows.length === 0 && (
            <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-8 text-center">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                Aún no hay movimientos.
              </p>
              <a 
                href="/agregar" 
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                Agregar uno
              </a>
            </div>
          )}
          {rows.map((m) => (
            <article 
              key={m.id} 
              className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {m.type === "IN" ? "Ingreso" : "Egreso"} {m.category ? `• ${m.category}` : ""}
                </p>
                <p className="text-base sm:text-lg text-gray-600">
                  {fmtDate(m.date)}{m.note ? ` — ${m.note}` : ""}
                </p>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${m.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                {m.type === "IN" ? "+" : "−"} {fmtMoney(m.amount)}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
