import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionUser } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Función para normalizar RUT (eliminar puntos y guión, siempre en mayúscula)
function normalizeRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

export async function POST(req: Request) {
  const { rut, password } = await req.json();
  if (!rut || !password) {
    return NextResponse.json({ ok: false, msg: "RUT y contraseña son requeridos" }, { status: 400 });
  }

  // Normalizar el RUT recibido
  const normalizedRut = normalizeRut(rut);

  // Buscar usuario: intentar primero con RUT normalizado, luego con formato
  // Normalizar siempre el dígito verificador a mayúscula (K)
  // Como el RUT puede estar guardado con o sin formato, buscamos ambos
  let user = await prisma.user.findUnique({ where: { rut: normalizedRut } });
  
  // Si no se encuentra con formato normalizado, buscar con formato
  if (!user) {
    // Intentar con formato (formatear el RUT normalizado)
    const formatRut = (value: string): string => {
      if (value.length <= 1) return value;
      const dv = value.slice(-1).toUpperCase(); // Asegurar mayúscula
      const numbers = value.slice(0, -1);
      if (numbers.length === 0) return dv;
      const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${formatted}-${dv}`;
    };
    const formattedRut = formatRut(normalizedRut);
    user = await prisma.user.findUnique({ where: { rut: formattedRut } });
  }
  
  // También normalizar el RUT del usuario encontrado para guardarlo correctamente
  if (user && user.rut !== normalizedRut) {
    // Actualizar el RUT en la BD a formato normalizado y mayúscula
    await prisma.user.update({
      where: { id: user.id },
      data: { rut: normalizedRut }
    });
    user.rut = normalizedRut;
  }

  if (!user) return NextResponse.json({ ok: false, msg: "Credenciales inválidas" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ ok: false, msg: "Credenciales inválidas" }, { status: 401 });

  const session = await getIronSession<{ user?: SessionUser }>(await cookies(), sessionOptions);
  session.user = { id: user.id, rut: user.rut };
  await session.save();

  return NextResponse.json({ ok: true });
}
