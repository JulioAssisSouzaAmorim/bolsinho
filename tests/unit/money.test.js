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

  it('ignora o prefixo R$ e espaços ao redor', () => {
    expect(parseAmount('  R$ 25,00 ')).toBe(2500);
  });

  it('aceita valores numéricos', () => {
    expect(parseAmount(12.34)).toBe(1234);
  });

  it('rejeita texto que não é um valor', () => {
    expect(() => parseAmount('abc')).toThrow('Valor inválido');
  });

  it('rejeita texto vazio', () => {
    expect(() => parseAmount('')).toThrow('Valor inválido');
  });
});
