import { useEffect, useState } from 'react'

export const useThrottleState = (state: string, delay = 500) => {
  const [throttledState, setThrottledState] = useState(state)

  useEffect(() => {
    const timeout = setTimeout(
      () => setThrottledState(state),
      state === '' ? 0 : delay,
    )

    return () => clearTimeout(timeout)
  }, [state, delay])

  return throttledState
}
