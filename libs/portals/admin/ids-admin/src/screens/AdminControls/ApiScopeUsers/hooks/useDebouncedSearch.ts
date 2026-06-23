import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useDebouncedSearch = (delay = 500) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('search') ?? ''
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10)
  const currentPage = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1

  const [localSearch, setLocalSearch] = useState(searchValue)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    setLocalSearch(searchValue)
  }, [searchValue])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const commitSearch = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        if (value) {
          prev.set('search', value)
        } else {
          prev.delete('search')
        }
        prev.set('page', '1')
        return prev
      })
    },
    [setSearchParams],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        commitSearch(value)
      }, delay)
    },
    [commitSearch, delay],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        prev.set('page', String(page))
        return prev
      })
    },
    [setSearchParams],
  )

  const clearSearch = useCallback(() => {
    setLocalSearch('')
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    commitSearch('')
  }, [commitSearch])

  return {
    localSearch,
    currentPage,
    handleSearch,
    handlePageChange,
    clearSearch,
  }
}
