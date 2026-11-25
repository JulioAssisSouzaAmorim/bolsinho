import { describe, expect, it } from 'vitest';
import { formatBRL, parseAmount } from '../../src/lib/money.js';

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

  it('rejeita mais de duas casas decimais', () => {
    expect(() => parseAmount('10,999')).toThrow('Valor inválido');
  });

  it('rejeita números não finitos e tipos inesperados', () => {
    expect(() => parseAmount(Infinity)).toThrow('Valor inválido');
    expect(() => parseAmount(null)).toThrow('Valor inválido');
  });
});

describe('formatBRL', () => {
  it('formata zero', () => {
    expect(formatBRL(0)).toBe('R$ 0,00');
  });

  it('formata centavos com dois dígitos', () => {
    expect(formatBRL(5)).toBe('R$ 0,05');
  });

  it('separa milhares com ponto', () => {
    expect(formatBRL(123456789)).toBe('R$ 1.234.567,89');
  });

  it('formata valores negativos com sinal na frente', () => {
    expect(formatBRL(-1050)).toBe('-R$ 10,50');
  });
});
