"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función para formatear RUT mientras se escribe
  const formatRut = (value: string): string => {
    // Eliminar todo excepto números y K/k
    let cleanValue = value.replace(/[^0-9kK]/g, "");
    
    // Limitar a 9 caracteres (8 números + dígito verificador)
    if (cleanValue.length > 9) {
      cleanValue = cleanValue.substring(0, 9);
    }

    // Si está vacío, retornar vacío
    if (cleanValue.length === 0) {
      return "";
    }

    // Si solo hay un carácter, retornarlo sin formato
    if (cleanValue.length === 1) {
      return cleanValue.toUpperCase();
    }

    // Separar el dígito verificador del resto
    const dv = cleanValue.slice(-1).toUpperCase();
    const numbers = cleanValue.slice(0, -1);

    // Si no hay números, solo retornar el dígito verificador
    if (numbers.length === 0) {
      return dv;
    }

    // Formatear números con puntos (cada 3 dígitos desde la derecha)
    let formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Agregar guión y dígito verificador
    return `${formatted}-${dv}`;
  };

  // Función para normalizar RUT (sin puntos ni guión) para enviar a la BD
  const normalizeRut = (value: string): string => {
    return value.replace(/[^0-9kK]/g, "").toUpperCase();
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatRut(inputValue);
    setRut(formatted);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // Normalizar el RUT antes de enviarlo (sin puntos ni guión)
      const normalizedRut = normalizeRut(rut);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut: normalizedRut, password })
      });
      if (res.ok) {
        router.replace("/");
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data?.msg ?? "Error al iniciar sesión");
      }
    } catch (error) {
      setErr("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header con logo/título */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#d32f2f] rounded-full mb-4 sm:mb-6 shadow-lg">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#d32f2f] mb-2 sm:mb-3">
            Financy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Campo RUT */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="rut" className="block text-xl sm:text-2xl font-semibold text-gray-800">
              RUT
            </label>
            <input
              id="rut"
              inputMode="text"
              autoComplete="username"
              className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 sm:py-5 text-xl sm:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
              placeholder="Ejemplo: 12.345.678-9"
              value={rut}
              onChange={handleRutChange}
              disabled={loading}
              required
            />
            <p className="text-sm sm:text-base text-gray-500 pl-1">
              Ingresa tu RUT con o sin puntos y guión
            </p>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="password" className="block text-xl sm:text-2xl font-semibold text-gray-800">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 sm:py-5 text-xl sm:text-2xl text-gray-900 placeholder:text-gray-400 focus:border-[#d32f2f] focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
              placeholder="Ejemplo: MiContraseña123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-sm sm:text-base text-gray-500 pl-1">
              Ingresa tu contraseña de acceso
            </p>
          </div>

          {/* Mensaje de error */}
          {err && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5">
              <p className="text-lg sm:text-xl text-[#d32f2f] font-medium text-center">
                {err}
              </p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#ff6f00] hover:bg-[#e65100] text-white text-xl sm:text-2xl font-bold py-5 sm:py-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 sm:h-7 sm:w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-base sm:text-lg text-gray-600">
            Sistema seguro de gestión financiera
          </p>
        </div>
      </div>
    </main>
  );
}
