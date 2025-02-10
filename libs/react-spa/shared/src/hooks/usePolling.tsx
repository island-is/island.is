import { useCallback, useEffect, useRef, useState } from 'react'

interface PollingResult<T> {
  data?: T
  loading: boolean
  error: Error | null
}

type UsePollingProps<T> = {
  /**
   * A function that fetches data (returns a promise).
   */
  fetcher(): Promise<T>
  /**
   * The interval in milliseconds for how often to poll.
   */
  intervalMs?: number
  /**
   * Optional prop for controlling polling externally.
   */
  isCancelledProp?: boolean
  /**
   * The time in milliseconds to wait before starting the polling.
   */
  waitToStartMS?: number
}

/**
 * usePolling is a custom hook for polling data at a specified interval.
 */
export const usePolling = <T,>({
  fetcher,
  intervalMs = 10000,
  isCancelledProp,
  waitToStartMS,
}: UsePollingProps<T>): PollingResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [shouldPoll, setShouldPoll] = useState(false)

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isCancelledRef = useRef(false)

  // Sync the external isCancelledProp with the ref to ensure real-time updates
  useEffect(() => {
    isCancelledRef.current = !!isCancelledProp
  }, [isCancelledProp])

  const poll = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetcher()

      if (!isCancelledRef.current) {
        setData(result)
        setError(null)
      }
    } catch (err) {
      if (!isCancelledRef.current) {
        setError(err as Error)
      }
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    // The cleanup function sets isCancelled to true to stop polling
    // If the polling resumes then we set it back to false
    isCancelledRef.current = false

    if (!shouldPoll) {
      return
    }

    // Initial poll
    poll()

    // Set up the interval for polling
    intervalIdRef.current = setInterval(poll, intervalMs)

    // Cleanup on unmount or when polling should stop
    return () => {
      isCancelledRef.current = true

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [fetcher, intervalMs, shouldPoll, poll])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (waitToStartMS) {
      timeoutId = setTimeout(() => {
        setShouldPoll(true)
      }, waitToStartMS)
    } else {
      setShouldPoll(true)
    }

    return () => {
      // Clear the timeout if the component unmounts before the timeout is reached
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [waitToStartMS])

  return { data, loading, error }
}
