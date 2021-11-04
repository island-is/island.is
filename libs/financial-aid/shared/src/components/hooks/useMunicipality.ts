import { useEffect, useState } from 'react'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { gql, useLazyQuery } from '@apollo/client'

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

  const [getMunicipality, { data, error, loading }] = useLazyQuery<
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

  const setMunicipality = async (municipalityId: string) => {
    try {
      getMunicipality({
        variables: {
          input: { id: municipalityId },
        },
      })

      if (data) {
        setScopedMunicipality(data?.municipality)
        sessionStorage.setItem(storageKey, JSON.stringify(data?.municipality))
        return data?.municipality
      }
    } catch {
      return undefined
    }
  }

  return {
    municipality,
    setMunicipality,
    error,
    loading,
  }
}
