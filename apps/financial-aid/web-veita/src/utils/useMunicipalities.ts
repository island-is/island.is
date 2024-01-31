import { useEffect, useState } from 'react'

import {
  ApiKeysForMunicipality,
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
      navUsername
      navPassword
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
    apiKeysForMunicipality {
      id
      name
      apiKey
      municipalityCode
    }
  }
`

export const useMunicipalities = () => {
  const [municipality, setMunicipality] = useState<Municipality[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const getMunicipality = useAsyncLazyQuery<{
    municipalityByIds: Municipality[]
  }>(MunicipalityQuery)

  useEffect(() => {
    setMunicipalityById()
  }, [])

  const setMunicipalityById = async () => {
    try {
      setError(undefined)
      setLoading(true)
      return await getMunicipality({}).then((res) => {
        setMunicipality(res.data?.municipalityByIds ?? [])
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
