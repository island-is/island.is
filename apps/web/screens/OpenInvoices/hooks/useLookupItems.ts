import { useEffect, useRef, useState } from 'react'

import { AsyncFilterItem } from '../components/AsyncFilterSearchAccordion'

/**
 * Resolves display data for a set of already-selected filter values (e.g.
 * values coming from URL query state on initial load) that may not be
 * present in the currently loaded page of an async filter.
 *
 * Fetches only values not yet resolved, and never re-fetches a value once its
 * item has been resolved.
 */
export const useLookupItems = (
  values: string[] | null | undefined,
  fetchLookup: (lookup: string[]) => Promise<AsyncFilterItem[]>,
) => {
  const [items, setItems] = useState<Record<string, AsyncFilterItem>>({})
  const resolvedRef = useRef<Set<string>>(new Set())
  const key = (values ?? []).join(',')

  useEffect(() => {
    const missing = (values ?? []).filter((v) => !resolvedRef.current.has(v))

    if (missing.length === 0) {
      return
    }

    let cancelled = false

    fetchLookup(missing)
      .then((resolved) => {
        if (cancelled) {
          return
        }
        missing.forEach((v) => resolvedRef.current.add(v))
        setItems((prev) => {
          const next = { ...prev }
          resolved.forEach((item) => {
            next[item.value] = item
          })
          return next
        })
      })
      .catch(() => {
        // Ignore lookup failures — the filter falls back to raw values.
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return items
}
