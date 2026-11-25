import { describe, expect, it } from 'vitest';
import { createRepository, STORAGE_KEY } from '../../src/lib/storage.js';
import { createMemoryStorage } from './helpers/memoryStorage.js';

const stored = {
  id: '1',
  description: 'Cinema',
  amountCents: 4000,
  type: 'despesa',
  category: 'Lazer',
  date: '2026-11-15',
};

describe('createRepository', () => {
  it('carrega lista vazia quando nada foi salvo', () => {
    expect(createRepository(createMemoryStorage()).load()).toEqual([]);
  });

  it('carrega as transações que foram salvas', () => {
    const repository = createRepository(createMemoryStorage());

    repository.save([stored]);

    expect(repository.load()).toEqual([stored]);
  });

  it('usa a chave padrão do Bolsinho', () => {
    const storage = createMemoryStorage();

    createRepository(storage).save([stored]);

    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toEqual([stored]);
  });

  it('ignora JSON corrompido', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{quebrado' });

    expect(createRepository(storage).load()).toEqual([]);
  });

  it('ignora conteúdo que não é uma lista', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{"id":"1"}' });

    expect(createRepository(storage).load()).toEqual([]);
  });

  it('descarta itens inválidos e mantém os válidos', () => {
    const invalid = { ...stored, id: '2', amountCents: -5 };
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify([stored, invalid, null]) });

    expect(createRepository(storage).load()).toEqual([stored]);
  });

  it('apaga os dados salvos', () => {
    const repository = createRepository(createMemoryStorage());
    repository.save([stored]);

    repository.clear();

    expect(repository.load()).toEqual([]);
  });
});
