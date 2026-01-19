import './App.css'
import React from 'react';
import { useHormoneResults } from './hooks/useHormoneResults';
import { Loading } from './components/Loading';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HormoneDetails } from './components/HormoneDetails';

const FILTER_OPTIONS = [
  { value: '', label: 'All Results' },
  { value: 'IN RANGE', label: 'IN RANGE' },
  { value: 'NOT IN RANGE', label: 'NOT IN RANGE' }
] as const;

function App() {
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const { results, loading, error } = useHormoneResults(statusFilter || undefined);
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set());

  const toggleExpanded = (resultId: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resultId)) {
        newSet.delete(resultId)
      } else {
        newSet.add(resultId)
      }
      return newSet
    })
  }

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
        Showing {results.length} results{statusFilter ? ` with status: ${statusFilter}` : ''}
      </div>

      <div className="results">
        <div className="resultsHeader">
          <p>result id</p>
          <p>user id</p>
          <p>status</p>
          <p></p>
        </div>
        <div className="resultsList">
          {
            results.map(result => {
              const isExpanded = expandedRows.has(result.id)
              const hasOutOfRange = result.outOfRangeHormones.length > 0
              
              return (
                <div key={result.id}>
                  <div 
                    className={`resultsItem ${hasOutOfRange ? 'clickableRow' : 'nonClickableRow'}`}
                    onClick={() => hasOutOfRange && toggleExpanded(result.id)}
                  >
                    <p>{result.id}</p>
                    <p>{result.userId}</p>
                    <p>
                      <span className={`statusPill ${
                        result.status === 'IN RANGE' ? 'statusInRange' : 
                        result.status === 'NOT IN RANGE' ? 'statusNotInRange' : 
                        'statusUnknown'
                      }`}>
                        {result.status}
                      </span>
                    </p>
                    <div className="expandArrow">
                      {hasOutOfRange && (isExpanded ? "▼" : "▶")}
                    </div>
                  </div>
                  {isExpanded && (
                    <HormoneDetails outOfRangeHormones={result.outOfRangeHormones} />
                  )}
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
