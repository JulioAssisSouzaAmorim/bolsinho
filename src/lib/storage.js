import { TYPES } from './transaction.js';

export const STORAGE_KEY = 'bolsinho:transacoes';

function isStoredTransaction(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.description === 'string' &&
    Number.isInteger(item.amountCents) &&
    item.amountCents > 0 &&
    TYPES.includes(item.type) &&
    typeof item.category === 'string' &&
    typeof item.date === 'string'
  );
}

/**
 * Repositório de transações sobre uma Storage Web (ex.: localStorage).
 * Dados corrompidos são ignorados em vez de quebrar a aplicação.
 */
export function createRepository(storage, key = STORAGE_KEY) {
  return {
    load() {
      try {
        const data = JSON.parse(storage.getItem(key) ?? '[]');
        return Array.isArray(data) ? data.filter(isStoredTransaction) : [];
      } catch {
        return [];
      }
    },
    save(transactions) {
      storage.setItem(key, JSON.stringify(transactions));
    },
    clear() {
      storage.removeItem(key);
    },
  };
}
