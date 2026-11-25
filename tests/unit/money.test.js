import { describe, expect, it } from 'vitest';
import { parseAmount } from '../../src/lib/money.js';

describe('parseAmount', () => {
  it('converte um número inteiro em centavos', () => {
    expect(parseAmount('10')).toBe(1000);
  });

  it('aceita vírgula como separador decimal', () => {
    expect(parseAmount('10,5')).toBe(1050);
  });
});
