import { useEffect, useState } from 'react'

import {
  Municipality,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'
import { gql } from '@apollo/client'

const MunicipalitiesQuery = gql`
  query getMunicipalities {
    municipalities {
      id
      name
      homepage
      active
      municipalityId
      email
      rulesHomepage
      individualAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        withOthers
        livesWithParents
        unknown
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        withOthers
        livesWithParents
        unknown
        type
      }
    }
  }
`

export const useMunicipality = () => {
  const storageKey = 'currentMunicipality'

  const [municipality, setScopedMunicipality] = useState<Municipality[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const getMunicipality = useAsyncLazyQuery<{
    municipalities: Municipality[]
  }>(MunicipalitiesQuery)

  useEffect(() => {
    setScopedMunicipality(
      sessionStorage.getItem(storageKey)
        ? JSON.parse(sessionStorage.getItem(storageKey) as string)
        : [],
    )
  }, [])

  const setMunicipality = (municipality: Municipality) => {
    setScopedMunicipality([municipality])
    sessionStorage.setItem(storageKey, JSON.stringify(municipality))
  }

  const setMunicipalityById = async (municipalityIds: string[]) => {
    try {
      setError(undefined)
      setLoading(true)
      return await getMunicipality({
        input: { ids: municipalityIds },
      }).then((res) => {
        setScopedMunicipality(res.data?.municipalities ?? [])
        sessionStorage.setItem(
          storageKey,
          JSON.stringify(res.data?.municipalities),
        )
        setLoading(false)
        return res.data?.municipalities
      })
    } catch (error: unknown) {
      setError(error as Error)
      setLoading(false)
      return undefined
    }
  }

  return {
    municipality,
    setMunicipalityById,
    setMunicipality,
    error,
    loading,
  }
}
