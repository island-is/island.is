import React, { useState, useEffect } from 'react'

interface UseDelayedFetchOptions {
  delay?: number
}

interface UseDelayedFetchResult {
  fetchData: string | null
  setTempData: React.Dispatch<React.SetStateAction<string | null>>
}

export function useDelayedFetch({
  delay = 1000,
}: UseDelayedFetchOptions = {}): UseDelayedFetchResult {
  const [fetchData, setFetchData] = useState<string | null>(null)
  const [tempData, setTempData] = useState<string | null>(null)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (tempData === '') {
      setFetchData(null)
    }

    if (tempData !== null) {
      timeoutId = setTimeout(() => {
        setFetchData(tempData)
      }, delay)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [tempData, delay])

  return { fetchData, setTempData }
}
