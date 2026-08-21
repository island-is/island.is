import { useEffect, useRef } from 'react'

// Seeds a screen's local form from freshly-loaded draft content exactly once,
// the first time `ready` becomes true — re-fetching that same content later
// (e.g. after a sync) must never re-seed and clobber in-progress edits.
export const useSeedOnce = (ready: boolean, seed: () => void) => {
  const seeded = useRef(false)
  useEffect(() => {
    if (!ready || seeded.current) return
    seeded.current = true
    seed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])
}
