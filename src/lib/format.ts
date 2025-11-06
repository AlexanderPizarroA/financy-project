export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const fmtDate = (d: Date | string) => {
  const date = new Date(d);
  return new Intl.DateTimeFormat("es-CL", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};