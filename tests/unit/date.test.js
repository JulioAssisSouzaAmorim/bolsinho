import { describe, expect, it } from 'vitest';
import { formatDateBR, isValidISODate } from '../../src/lib/date.js';

describe('isValidISODate', () => {
  it('aceita uma data real no formato AAAA-MM-DD', () => {
    expect(isValidISODate('2026-11-25')).toBe(true);
  });

  it('aceita 29 de fevereiro em ano bissexto', () => {
    expect(isValidISODate('2024-02-29')).toBe(true);
  });

  it('rejeita datas que não existem no calendário', () => {
    expect(isValidISODate('2026-02-30')).toBe(false);
  });

  it('rejeita outros formatos e tipos', () => {
    expect(isValidISODate('25/11/2026')).toBe(false);
    expect(isValidISODate(undefined)).toBe(false);
  });
});

describe('formatDateBR', () => {
  it('converte para o formato DD/MM/AAAA', () => {
    expect(formatDateBR('2026-11-25')).toBe('25/11/2026');
  });

  it('lança erro para datas inválidas', () => {
    expect(() => formatDateBR('2026-13-01')).toThrow('Data inválida');
  });
});
