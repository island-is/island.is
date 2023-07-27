import { MinistrySlug, MinistryList } from '@island.is/regulations'
import { useEffect, useRef, useState } from 'react'
import { RegulationDraft } from '@island.is/regulations/admin'

export const useMockQuery = <T>(data: T, skip?: boolean) => {
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<Error | undefined>(undefined)

  const timeout = useRef<ReturnType<typeof setTimeout> | null>()
  useEffect(() => {
    const d = Math.random()
    timeout.current = setTimeout(() => {
      if (Math.random() < 0.1) {
        setError(new Error('Mock data loading error'))
      }
      setLoading(false)
    }, 1000 * d * d)
    return () => {
      timeout.current && clearTimeout(timeout.current)
    }
  }, [])

  return loading || skip
    ? { loading }
    : error
    ? { error, loading: false }
    : { data, loading: false }
}

// ---------------------------------------------------------------------------

export const mockSave = (_: RegulationDraft) =>
  new Promise((resolve) => setTimeout(resolve, 800))

// ---------------------------------------------------------------------------

export const mockMinistrylist: MinistryList = [
  {
    name: 'Forsætisráðuneyti',
    slug: 'fsr' as MinistrySlug,
  },
  {
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn' as MinistrySlug,
  },
]
