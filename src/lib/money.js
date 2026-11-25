const AMOUNT_PATTERN = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$|^\d+\.\d{1,2}$/;

/**
 * Converte um valor digitado pelo usuário (ex.: "1.234,56", "10.5", "R$ 7")
 * em centavos inteiros. Lança erro quando o texto não representa um valor.
 */
export function parseAmount(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Valor inválido');
    return Math.round(value * 100);
  }
  if (typeof value !== 'string') throw new Error('Valor inválido');

  const cleaned = value.trim().replace(/^R\$\s*/, '');
  if (!AMOUNT_PATTERN.test(cleaned)) throw new Error('Valor inválido');

  const normalized = /^\d+\.\d{1,2}$/.test(cleaned)
    ? cleaned
    : cleaned.replace(/\./g, '').replace(',', '.');
  return Math.round(Number(normalized) * 100);
}
