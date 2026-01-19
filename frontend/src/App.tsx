import { useMemo } from 'react';
import './App.css'
import React from 'react';
import { useHormoneResults } from './hooks/useHormoneResults';
import { Loading } from './components/Loading';
import { ErrorDisplay } from './components/ErrorDisplay';

const FILTER_OPTIONS = [
  { value: "ALL", label: "All Results" },
  { value: "IN RANGE", label: "IN RANGE" },
  { value: "NOT IN RANGE", label: "NOT IN RANGE" }
] as const;

function App() {
  const { results, loading, error } = useHormoneResults()
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")

  const filteredResults = useMemo(() => {
    if (statusFilter === "ALL") return results;
    return results.filter(result => result.status === statusFilter);
  }, [results, statusFilter]);

  if (loading) {
    return (
      <div>
        <h2>Hertility admin dashboard</h2>
        <Loading message="Loading hormone results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>Hertility admin dashboard</h2>
        <ErrorDisplay message={error} />
      </div>
    )
  }

  return (
    <div> 
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <div className="filterControls">
        <label htmlFor="statusFilter">Filter by status: </label>
        <select 
          id="statusFilter"
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="resultsCount">
        Showing {filteredResults.length} of {results.length} results
      </div>

      <div className="results">
        <div className="resultsHeader">
          <p>result id</p>
          <p>user id</p>
          <p>status</p>
        </div>
        <div className="resultsList">
          {
            filteredResults.map(result => {

              return (
                <div className="resultsItem" key={result.id}>
                    <p>{result.id}</p>
                    <p>{result.userId}</p>
                    <p>{result.status}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
