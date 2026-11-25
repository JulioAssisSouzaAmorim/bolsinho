// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from '../../src/app.js';
import { createRepository } from '../../src/lib/storage.js';
import { createMemoryStorage } from './helpers/memoryStorage.js';

const html = readFileSync(resolve(process.cwd(), 'src/index.html'), 'utf8');

const aluguel = {
  id: 'a',
  description: 'Aluguel',
  amountCents: 150000,
  type: 'despesa',
  category: 'Moradia',
  date: '2026-11-10',
};

let repository;

function start(initial = []) {
  document.body.innerHTML = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
  repository = createRepository(createMemoryStorage());
  repository.save(initial);
  return mountApp({ root: document, repository, today: () => '2026-11-25' });
}

const text = (selector) => document.querySelector(selector).textContent;
const listItems = () => [...document.querySelectorAll('#lista-transacoes li')];

function submit(values) {
  const fields = document.querySelector('#form-transacao').elements;
  for (const [name, value] of Object.entries(values)) fields[name].value = value;
  document.querySelector('#form-transacao').requestSubmit();
}

describe('mountApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mostra as transações salvas e o resumo ao iniciar', () => {
    start([aluguel]);

    expect(listItems()).toHaveLength(1);
    expect(text('#total-despesas')).toBe('R$ 1.500,00');
    expect(text('#saldo')).toBe('-R$ 1.500,00');
  });

  it('preenche a data do formulário com o dia atual', () => {
    start();

    expect(document.querySelector('[name="date"]').value).toBe('2026-11-25');
  });
});
