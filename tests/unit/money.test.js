import { describe, expect, it } from 'vitest';
import { parseAmount } from '../../src/lib/money.js';

describe('parseAmount', () => {
  it('converte um número inteiro em centavos', () => {
    expect(parseAmount('10')).toBe(1000);
  });

  it('aceita vírgula como separador decimal', () => {
    expect(parseAmount('10,5')).toBe(1050);
  });

  it('aceita ponto como separador de milhar', () => {
    expect(parseAmount('1.234,56')).toBe(123456);
  });

  it('aceita ponto como separador decimal quando há até duas casas', () => {
    expect(parseAmount('10.50')).toBe(1050);
  });
});
