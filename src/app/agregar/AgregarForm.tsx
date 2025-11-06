"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgregarForm() {
  const router = useRouter();
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para formatear monto mientras se escribe
  const formatAmount = (value: string): string => {
    // Eliminar todo excepto números
    let cleanValue = value.replace(/[^0-9]/g, "");
    
    // Si está vacío, retornar vacío
    if (cleanValue.length === 0) {
      return "";
    }

    // Convertir a número y formatear con puntos como separador de miles
    const numValue = parseInt(cleanValue, 10);
    if (isNaN(numValue)) return "";

    // Formatear con puntos cada 3 dígitos desde la derecha
    return numValue.toLocaleString("es-CL");
  };

  // Función para normalizar monto (sin puntos) para enviar a la BD
  const normalizeAmount = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatAmount(inputValue);
    setAmount(formatted);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Normalizar el monto antes de enviarlo (sin puntos)
      const normalizedAmount = normalizeAmount(amount);
      const res = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(normalizedAmount),
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
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#d32f2f] mb-2">Agregar movimiento</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">La fecha y hora se registrarán automáticamente</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() => setType("IN")}
            className={`py-3 sm:py-4 lg:py-5 rounded-2xl border-2 text-lg sm:text-xl lg:text-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              type === "IN" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                : "border-gray-300 bg-white text-gray-700 hover:border-emerald-300"
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Ingreso</span>
            <span className="sm:hidden">+</span>
          </button>
          <button
            type="button"
            onClick={() => setType("OUT")}
            className={`py-3 sm:py-4 lg:py-5 rounded-2xl border-2 text-lg sm:text-xl lg:text-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              type === "OUT" 
                ? "bg-rose-600 text-white border-rose-600 shadow-lg" 
                : "border-gray-300 bg-white text-gray-700 hover:border-rose-300"
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <span className="hidden sm:inline">Egreso</span>
            <span className="sm:hidden">-</span>
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="amount" className="block text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Monto
          </label>
          <input
            id="amount"
            inputMode="numeric"
            placeholder="Ejemplo: 50.000"
            className="w-full rounded-2xl border-2 border-gray-300 px-4 sm:px-5 py-3 sm:py-4 lg:py-5 text-lg sm:text-xl lg:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
            value={amount}
            onChange={handleAmountChange}
            disabled={loading}
            required
          />
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 pl-1">El monto se formatea automáticamente</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="note" className="block text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Nota (opcional)
          </label>
          <input
            id="note"
            className="w-full rounded-2xl border-2 border-gray-300 px-4 sm:px-5 py-3 sm:py-4 lg:py-5 text-lg sm:text-xl lg:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
            placeholder="Ejemplo: Pago mensual, Compra en supermercado..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 pl-1">Agrega detalles adicionales</p>
        </div>

        {err && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 sm:p-4 lg:p-5">
            <p className="text-base sm:text-lg lg:text-xl text-[#d32f2f] font-medium text-center">{err}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#ff6f00] hover:bg-[#e65100] text-white text-lg sm:text-xl lg:text-2xl font-bold py-4 sm:py-5 lg:py-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </main>
  );
}
