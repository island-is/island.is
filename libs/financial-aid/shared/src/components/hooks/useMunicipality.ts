import { useEffect, useState } from 'react'

import {
  Municipality,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'
import { gql } from '@apollo/client'

const MunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
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
        livesWithParents
        unknown
        withOthers
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
    }
  }
`

export const useMunicipality = () => {
  const storageKey = 'currentMunicipality'

  const [municipality, setScopedMunicipality] = useState<Municipality>()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const getMunicipality = useAsyncLazyQuery<
    {
      municipality: Municipality
    },
    { input: { id: string } }
  >(MunicipalityQuery)

  useEffect(() => {
    setScopedMunicipality(
      sessionStorage.getItem(storageKey)
        ? JSON.parse(sessionStorage.getItem(storageKey) as string)
        : undefined,
    )
  }, [])

  const setMunicipality = (municipality: Municipality) => {
    setScopedMunicipality(municipality)
    sessionStorage.setItem(storageKey, JSON.stringify(municipality))
  }

  const setMunicipalityById = async (municipalityId: string) => {
    try {
      setError(undefined)
      setLoading(true)
      return await getMunicipality({
        input: { id: municipalityId },
      }).then((res) => {
        setScopedMunicipality(res.data?.municipality)
        sessionStorage.setItem(
          storageKey,
          JSON.stringify(res.data?.municipality),
        )
        setLoading(false)
        return res.data?.municipality
      })
    } catch (error) {
      setError(error)
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
