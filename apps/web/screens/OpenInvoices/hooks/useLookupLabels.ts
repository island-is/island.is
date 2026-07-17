import { useEffect, useRef, useState } from 'react'

export interface LookupItem {
  value: string
  label: string
}

/**
 * Resolves display labels for a set of already-selected filter values (e.g.
 * values coming from URL query state on initial load) that may not be
 * present in the currently loaded page of an async filter.
 *
 * Fetches labels only for values not yet resolved, and never re-fetches a
 * value once its label has been resolved.
 */
export const useLookupLabels = (
  values: string[] | null | undefined,
  fetchLookup: (lookup: string[]) => Promise<LookupItem[]>,
) => {
  const [labels, setLabels] = useState<Record<string, string>>({})
  const resolvedRef = useRef<Set<string>>(new Set())
  const key = (values ?? []).join(',')

  useEffect(() => {
    const missing = (values ?? []).filter((v) => !resolvedRef.current.has(v))

    if (missing.length === 0) {
      return
    }

    missing.forEach((v) => resolvedRef.current.add(v))

    let cancelled = false

    fetchLookup(missing)
      .then((items) => {
        if (cancelled) {
          return
        }
        setLabels((prev) => {
          const next = { ...prev }
          items.forEach((item) => {
            next[item.value] = item.label
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

  return labels
}
