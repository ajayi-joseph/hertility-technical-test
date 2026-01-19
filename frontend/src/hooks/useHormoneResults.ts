import { useEffect, useState } from 'react';
import { Results } from '../types/results';

const fetchResults = async () => {
  try {
    const res = await fetch("http://localhost:52863/results")
    const json = await res.json()
    return json as Results[]
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useHormoneResults = () => {
  const [results, setResults] = useState<Results[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchResults()
        setResults(data)
      } catch (err) {
        setError('Failed to load hormone results')
        console.error('Error fetching results:', err)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  return { results, loading, error }
}