import { useEffect, useState } from 'react'

import {
  Municipality,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'
import { gql } from '@apollo/client'

const MunicipalityQuery = gql`
  query GetMunicipalityQuery {
    municipalityByIds {
      id
      name
      homepage
      active
      municipalityId
      email
      rulesHomepage
      usingNav
      navUrl
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

export const useMunicipalities = () => {
  const storageKey = 'currentMunicipalities'

  const [municipality, setScopedMunicipality] = useState<Municipality[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const getMunicipality = useAsyncLazyQuery<{
    municipalityByIds: Municipality[]
  }>(MunicipalityQuery)

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      setScopedMunicipality(
        JSON.parse(sessionStorage.getItem(storageKey) as string),
      )
      return
    }
    setMunicipalityById()
  }, [])

  const setMunicipality = (municipality: Municipality[]) => {
    setScopedMunicipality(municipality)
    sessionStorage.setItem(storageKey, JSON.stringify(municipality))
  }

  const setMunicipalityById = async () => {
    try {
      setError(undefined)
      setLoading(true)
      return await getMunicipality({}).then((res) => {
        setScopedMunicipality(res.data?.municipalityByIds ?? [])
        sessionStorage.setItem(
          storageKey,
          JSON.stringify(res.data?.municipalityByIds),
        )
        setLoading(false)
        return res.data?.municipalityByIds ?? []
      })
    } catch (error: unknown) {
      setError(error as Error)
      setLoading(false)
      return []
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
