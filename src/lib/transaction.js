import { parseAmount } from './money.js';
import { isValidISODate } from './date.js';

export const TYPES = Object.freeze(['receita', 'despesa']);

export const CATEGORIES = Object.freeze([
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Outros',
]);

export const MAX_DESCRIPTION_LENGTH = 60;

export class ValidationError extends Error {
  constructor(errors) {
    super(Object.values(errors).join(' '));
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

function defaultId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function readAmount(raw) {
  try {
    return parseAmount(raw);
  } catch {
    return NaN;
  }
}

/**
 * Valida os dados de uma transação e devolve a transação normalizada
 * (valor em centavos, descrição sem espaços extras). Lança ValidationError
 * com uma mensagem por campo inválido.
 */
export function createTransaction(input, { idGenerator = defaultId } = {}) {
  const description = String(input.description ?? '').trim();
  const amountCents = readAmount(input.amount);
  const errors = {};

  if (!description) {
    errors.description = 'Informe uma descrição.';
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }
  if (!(amountCents > 0)) errors.amount = 'Informe um valor maior que zero.';
  if (!TYPES.includes(input.type)) errors.type = 'Escolha receita ou despesa.';
  if (!CATEGORIES.includes(input.category)) errors.category = 'Escolha uma categoria válida.';
  if (!isValidISODate(input.date)) errors.date = 'Informe uma data válida.';

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);

  return Object.freeze({
    id: idGenerator(),
    description,
    amountCents,
    type: input.type,
    category: input.category,
    date: input.date,
  });
}
