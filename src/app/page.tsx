import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { fmtMoney } from "@/lib/format";
import Header from "@/components/Header";

async function getSaldo(userId: string) {
  const [ins, outs] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: "IN" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "OUT" }, _sum: { amount: true } }),
  ]);
  return Number(ins._sum.amount ?? 0) - Number(outs._sum.amount ?? 0);
}

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const saldo = await getSaldo(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d32f2f] mb-2">
            Tu efectivo
          </h1>
        </div>

        <section className="grid gap-6 sm:gap-8">
          <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-xl p-6 sm:p-8">
            <p className="text-lg sm:text-xl text-gray-600 font-medium">Saldo actual</p>
            <p className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-3 mb-2 text-gray-900">{fmtMoney(saldo)}</p>
            <p className="text-sm sm:text-base text-gray-500">Actualizado ahora</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link 
              href="/agregar" 
              className="flex-1 text-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-4 sm:py-5 text-xl sm:text-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Agregar movimiento
            </Link>
            <Link 
              href="/movimientos" 
              className="flex-1 text-center rounded-2xl border-2 border-gray-300 hover:border-[#d32f2f] bg-white hover:bg-red-50 py-4 sm:py-5 text-xl sm:text-2xl font-bold text-gray-900 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Ver historial
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
