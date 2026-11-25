import { describe, expect, it } from 'vitest';
import { isValidISODate } from '../../src/lib/date.js';

describe('isValidISODate', () => {
  it('aceita uma data real no formato AAAA-MM-DD', () => {
    expect(isValidISODate('2026-11-25')).toBe(true);
  });

  it('aceita 29 de fevereiro em ano bissexto', () => {
    expect(isValidISODate('2024-02-29')).toBe(true);
  });
});
