import { renderHook, waitFor } from '@testing-library/react';
import { useHormoneResults } from '../useHormoneResults';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const createMockResponse = (data: any, shouldThrow = false) => ({
  json: shouldThrow ? 
    async () => { throw new Error('Invalid JSON'); } : 
    async () => data,
  ok: true,
  status: 200
});

describe('useHormoneResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const originalError = console.error;
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && (
        args[0].includes('Warning: An update to') ||
        args[0].includes('not wrapped in act') ||
        args[0].includes('not configured to support act')
      )) {
        return;
      }
      originalError.call(console, ...args);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should start with loading state', () => {
    mockFetch.mockResolvedValueOnce(createMockResponse([]));

    const { result } = renderHook(() => useHormoneResults());

    expect(result.current.loading).toBe(true);
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should successfully load hormone results', async () => {
    const mockResults = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: 'AMH', units: 'pmol/L', value: 50 }],
        status: 'IN RANGE',
        outOfRangeHormones: []
      }
    ];

    mockFetch.mockResolvedValueOnce(createMockResponse(mockResults));

    const { result } = renderHook(() => useHormoneResults());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.results).toEqual(mockResults);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useHormoneResults());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Failed to load hormone results');

    consoleErrorSpy.mockRestore();
  });

  it('should handle invalid JSON responses', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce(createMockResponse(null, true));

    const { result } = renderHook(() => useHormoneResults());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Failed to load hormone results');

    consoleErrorSpy.mockRestore();
  });

  it('should make API call to correct endpoint', () => {
    mockFetch.mockResolvedValueOnce(createMockResponse([]));

    renderHook(() => useHormoneResults());

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:52863/results');
  });
});