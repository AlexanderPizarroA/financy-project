"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgregarForm() {
  const router = useRouter();
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(amount),
          category: category || null,
          note: note || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.msg ?? "Error al guardar");
        return;
      }

      router.push("/movimientos");
    } catch (error) {
      setErr("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d32f2f] mb-2">Agregar movimiento</h1>
          <p className="text-gray-600 text-base sm:text-lg">La fecha y hora se registrarán automáticamente</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setType("IN")}
            className={`py-4 sm:py-5 rounded-2xl border-2 text-xl sm:text-2xl font-bold transition-all ${
              type === "IN" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                : "border-gray-300 bg-white text-gray-700 hover:border-emerald-300"
            }`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setType("OUT")}
            className={`py-4 sm:py-5 rounded-2xl border-2 text-xl sm:text-2xl font-bold transition-all ${
              type === "OUT" 
                ? "bg-rose-600 text-white border-rose-600 shadow-lg" 
                : "border-gray-300 bg-white text-gray-700 hover:border-rose-300"
            }`}
          >
            Egreso
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="amount" className="block text-xl sm:text-2xl font-semibold text-gray-800">
            Monto
          </label>
          <input
            id="amount"
            inputMode="numeric"
            placeholder="Ejemplo: 50000"
            className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 sm:py-5 text-xl sm:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            disabled={loading}
            required
          />
          <p className="text-sm sm:text-base text-gray-500 pl-1">Ingresa el monto sin puntos ni comas</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="category" className="block text-xl sm:text-2xl font-semibold text-gray-800">
            Categoría (opcional)
          </label>
          <input
            id="category"
            className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 sm:py-5 text-xl sm:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
            placeholder="Ejemplo: Sueldo, Comida, Transporte..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm sm:text-base text-gray-500 pl-1">Clasifica tu movimiento</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="note" className="block text-xl sm:text-2xl font-semibold text-gray-800">
            Nota (opcional)
          </label>
          <input
            id="note"
            className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 sm:py-5 text-xl sm:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
            placeholder="Ejemplo: Pago mensual, Compra en supermercado..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm sm:text-base text-gray-500 pl-1">Agrega detalles adicionales</p>
        </div>

        {err && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5">
            <p className="text-lg sm:text-xl text-[#d32f2f] font-medium text-center">{err}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#ff6f00] hover:bg-[#e65100] text-white text-xl sm:text-2xl font-bold py-5 sm:py-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </main>
  );
}

