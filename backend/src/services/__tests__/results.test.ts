import { isHormoneInRange, calculateResultStatus } from '../results';

describe('isHormoneInRange', () => {
  test('returns true for values within range', () => {
    expect(isHormoneInRange('AMH', 50)).toBe(true);
    expect(isHormoneInRange('FSH', 8)).toBe(true);
  });

  test('returns false for values below range', () => {
    expect(isHormoneInRange('AMH', 5)).toBe(false);
    expect(isHormoneInRange('FSH', 3)).toBe(false);
  });

  test('returns false for values above range', () => {
    expect(isHormoneInRange('AMH', 100)).toBe(false);
    expect(isHormoneInRange('FSH', 15)).toBe(false);
  });

  test('returns true for values at range boundaries', () => {
    expect(isHormoneInRange('AMH', 7.14)).toBe(true);
    expect(isHormoneInRange('AMH', 95)).toBe(true);
    expect(isHormoneInRange('LH', 2.4)).toBe(true);
    expect(isHormoneInRange('LH', 12.6)).toBe(true);
  });
});

describe('calculateResultStatus', () => {
  test('returns "IN RANGE" for all hormones within range', () => {
    const hormoneResults = [
      { code: 'AMH', units: 'pmol/L', value: 50 },
      { code: 'FSH', units: 'IU/L', value: 8 },
      { code: 'LH', units: 'IU/L', value: 5 }
    ];
    expect(calculateResultStatus(hormoneResults)).toBe('IN RANGE');
  });

  test('returns "NOT IN RANGE" when any hormone is out of range', () => {
    const hormoneResults = [
      { code: 'AMH', units: 'pmol/L', value: 50 },
      { code: 'FSH', units: 'IU/L', value: 20 },
      { code: 'LH', units: 'IU/L', value: 5 }
    ];
    expect(calculateResultStatus(hormoneResults)).toBe('NOT IN RANGE');
  });

  test('returns "NOT IN RANGE" for multiple hormones out of range', () => {
    const hormoneResults = [
      { code: 'AMH', units: 'pmol/L', value: 200 },
      { code: 'FSH', units: 'IU/L', value: 20 },
    ];
    expect(calculateResultStatus(hormoneResults)).toBe('NOT IN RANGE');
  });

  test('returns "UNKNOWN" for empty hormone results', () => {
    expect(calculateResultStatus([])).toBe('UNKNOWN');
  });

  test('ignores unknown hormone codes', () => {
    const hormoneResults = [
      { code: 'AMH', units: 'pmol/L', value: 50 },
      { code: 'UNKNOWN_HORMONE', units: 'unit', value: 999 },
      { code: 'FSH', units: 'IU/L', value: 8 }
    ];
    expect(calculateResultStatus(hormoneResults)).toBe('IN RANGE');
  });

  test('handles edge case with only unknown hormone codes', () => {
    const hormoneResults = [
      { code: 'UNKNOWN_HORMONE1', units: 'unit', value: 999 },
      { code: 'UNKNOWN_HORMONE2', units: 'unit', value: 888 }
    ];
    expect(calculateResultStatus(hormoneResults)).toBe('IN RANGE');
  });
});