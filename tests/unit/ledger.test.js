import { describe, expect, it } from 'vitest';
import { addTransaction, removeTransaction } from '../../src/lib/ledger.js';

function tx(overrides) {
  return {
    id: 'x',
    description: 'Item',
    amountCents: 1000,
    type: 'despesa',
    category: 'Outros',
    date: '2026-11-01',
    ...overrides,
  };
}

const salario = tx({ id: 's', description: 'Salário', amountCents: 500000, type: 'receita', category: 'Salário', date: '2026-11-05' });
const aluguel = tx({ id: 'a', description: 'Aluguel', amountCents: 150000, category: 'Moradia', date: '2026-11-10' });
const pizza = tx({ id: 'p', description: 'Pizza de sexta', amountCents: 6000, category: 'Alimentação', date: '2026-11-07' });
const feira = tx({ id: 'f', description: 'Feira', amountCents: 9000, category: 'Alimentação', date: '2026-11-02' });
const all = [salario, aluguel, pizza, feira];

describe('addTransaction', () => {
  it('adiciona a transação ao final sem alterar a lista original', () => {
    const original = [salario];

    const result = addTransaction(original, aluguel);

    expect(result).toEqual([salario, aluguel]);
    expect(original).toEqual([salario]);
  });
});
