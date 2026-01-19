import { useEffect, useState } from 'react';
import { Results } from '../types/results';

const fetchResults = async (status?: string) => {
  try {
    const url = new URL("http://localhost:52863/results");
    if (status) {
      url.searchParams.append('status', status);
    }
    const res = await fetch(url.toString());
    const json = await res.json();
    return json as Results[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useHormoneResults = (status?: string) => {
  const [results, setResults] = useState<Results[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchResults(status);
        setResults(data);
      } catch (err) {
        setError('Failed to load hormone results');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [status]);

  return { results, loading, error };
};