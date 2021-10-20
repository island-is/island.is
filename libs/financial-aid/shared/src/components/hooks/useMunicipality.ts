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
      individualAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        type
      }
    }
  }
`

export const useMunicipality = () => {
  const storageKey = 'currentMunicipality'

  const [municipality, setScopedMunicipality] = useState<Municipality>()

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

  const setMunicipality = async (municipalityId: string) => {
    try {
      const { data } = await getMunicipality({
        input: { id: municipalityId },
      })

      setScopedMunicipality(data?.municipality)
      sessionStorage.setItem(storageKey, JSON.stringify(data?.municipality))
      return data?.municipality
    } catch {
      return undefined
    }
  }

  return { municipality, setMunicipality }
}
