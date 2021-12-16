import { RegName, MinistrySlug } from '@island.is/regulations'
import { RegulationMinistryList } from '@island.is/regulations/web'
import { useEffect, useRef, useState } from 'react'
import { RegulationDraft, RegulationList } from '@island.is/regulations/admin'
// import { } from './utils'

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

export const mockMinistrylist: RegulationMinistryList = [
  {
    name: 'Forsætisráðuneyti',
    slug: 'fsr' as MinistrySlug,
  },
  {
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn' as MinistrySlug,
  },
]

// ---------------------------------------------------------------------------

export const mockRegulationOptions: RegulationList = [
  {
    name: '0244/2021' as RegName,
    title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
    migrated: true,
  },
  {
    name: '0245/2021' as RegName,
    title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
    cancelled: true,
    migrated: true,
  },
  {
    name: '0001/1975' as RegName,
    title: 'Reglugerð um eitthvað gamalt og gott.',
    migrated: false,
  },
  {
    name: '1270/2016' as RegName,
    title:
      'Reglugerð um ákvörðun framlaga úr sveitarsjóði til sjálfstætt rekinna grunnskóla.',
    migrated: true,
  },
]
