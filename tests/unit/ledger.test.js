import { describe, expect, it } from 'vitest';
import {
  addTransaction,
  filterTransactions,
  removeTransaction,
  sortByDateDesc,
  summarize,
  totalsByCategory,
} from '../../src/lib/ledger.js';

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

describe('removeTransaction', () => {
  it('remove a transação com o id informado', () => {
    expect(removeTransaction(all, 'a')).toEqual([salario, pizza, feira]);
  });

  it('mantém a lista quando o id não existe', () => {
    expect(removeTransaction(all, 'inexistente')).toEqual(all);
  });
});

describe('summarize', () => {
  it('retorna zeros para lista vazia', () => {
    expect(summarize([])).toEqual({ incomeCents: 0, expenseCents: 0, balanceCents: 0 });
  });

  it('soma receitas, despesas e calcula o saldo', () => {
    expect(summarize(all)).toEqual({
      incomeCents: 500000,
      expenseCents: 165000,
      balanceCents: 335000,
    });
  });

  it('produz saldo negativo quando as despesas superam as receitas', () => {
    expect(summarize([aluguel]).balanceCents).toBe(-150000);
  });
});

describe('filterTransactions', () => {
  it('sem filtros devolve todas as transações', () => {
    expect(filterTransactions(all)).toEqual(all);
  });

  it('filtra por tipo', () => {
    expect(filterTransactions(all, { type: 'receita' })).toEqual([salario]);
  });

  it('filtra por categoria', () => {
    expect(filterTransactions(all, { category: 'Alimentação' })).toEqual([pizza, feira]);
  });

  it('busca na descrição ignorando maiúsculas e acentos', () => {
    expect(filterTransactions(all, { search: 'SALARIO' })).toEqual([salario]);
  });

  it('combina tipo, categoria e busca', () => {
    const result = filterTransactions(all, { type: 'despesa', category: 'Alimentação', search: 'piz' });

    expect(result).toEqual([pizza]);
  });
});

describe('sortByDateDesc', () => {
  it('ordena da data mais recente para a mais antiga sem alterar a original', () => {
    const original = [...all];

    expect(sortByDateDesc(original)).toEqual([aluguel, pizza, salario, feira]);
    expect(original).toEqual(all);
  });
});

describe('totalsByCategory', () => {
  it('soma apenas despesas, da maior para a menor categoria', () => {
    expect(totalsByCategory(all)).toEqual([
      { category: 'Moradia', totalCents: 150000 },
      { category: 'Alimentação', totalCents: 15000 },
    ]);
  });
});
