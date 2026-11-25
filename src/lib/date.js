const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Indica se o texto é uma data real no formato AAAA-MM-DD. */
export function isValidISODate(value) {
  if (typeof value !== 'string') return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Converte "2026-11-25" em "25/11/2026". */
export function formatDateBR(isoDate) {
  if (!isValidISODate(isoDate)) throw new Error('Data inválida');
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
