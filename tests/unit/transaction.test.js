import { describe, expect, it } from 'vitest';
import {
  createTransaction,
  MAX_DESCRIPTION_LENGTH,
  ValidationError,
} from '../../src/lib/transaction.js';

const validInput = {
  description: 'Mercado',
  amount: '150,90',
  type: 'despesa',
  category: 'Alimentação',
  date: '2026-11-20',
};

function errorsFor(input) {
  try {
    createTransaction(input);
  } catch (error) {
    if (error instanceof ValidationError) return error.errors;
    throw error;
  }
  throw new Error('era esperado um ValidationError');
}

describe('createTransaction com dados válidos', () => {
  it('cria a transação com o valor em centavos', () => {
    const transaction = createTransaction(validInput, { idGenerator: () => 'id-1' });

    expect(transaction).toEqual({
      id: 'id-1',
      description: 'Mercado',
      amountCents: 15090,
      type: 'despesa',
      category: 'Alimentação',
      date: '2026-11-20',
    });
  });

  it('remove espaços extras da descrição', () => {
    const transaction = createTransaction({ ...validInput, description: '  Padaria  ' });

    expect(transaction.description).toBe('Padaria');
  });

  it('gera identificadores diferentes por padrão', () => {
    const first = createTransaction(validInput);
    const second = createTransaction(validInput);

    expect(first.id).not.toBe(second.id);
  });

  it('devolve uma transação imutável', () => {
    const transaction = createTransaction(validInput);

    expect(Object.isFrozen(transaction)).toBe(true);
  });
});

describe('createTransaction com dados inválidos', () => {
  it('exige uma descrição', () => {
    expect(errorsFor({ ...validInput, description: '   ' })).toEqual({
      description: 'Informe uma descrição.',
    });
  });

  it('limita o tamanho da descrição', () => {
    const description = 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1);

    expect(errorsFor({ ...validInput, description })).toHaveProperty('description');
  });

  it('exige valor maior que zero', () => {
    expect(errorsFor({ ...validInput, amount: '0' })).toEqual({
      amount: 'Informe um valor maior que zero.',
    });
  });

  it('rejeita tipo desconhecido', () => {
    expect(errorsFor({ ...validInput, type: 'transferência' })).toHaveProperty('type');
  });
});
