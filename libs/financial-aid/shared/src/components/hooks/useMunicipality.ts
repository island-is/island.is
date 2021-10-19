import { useEffect, useState } from 'react'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { gql, useLazyQuery } from '@apollo/client'

interface MunicipalityData {
  municipality: Municipality
}

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

  const [getMunicipality] = useLazyQuery<MunicipalityData>(MunicipalityQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (data: { municipality: Municipality }) => {
      setScopedMunicipality(data.municipality)
      sessionStorage.setItem(storageKey, JSON.stringify(data.municipality))
    },
    onError: (error) => {
      // TODO: What should happen here?
      console.log(error)
    },
  })

  useEffect(() => {
    setScopedMunicipality(
      sessionStorage.getItem(storageKey)
        ? JSON.parse(sessionStorage.getItem(storageKey) as string)
        : undefined,
    )
  }, [])

  const setMunicipality = async (municipalityId: string) => {
    getMunicipality({
      variables: { input: { id: municipalityId } },
    })
  }

  return { municipality, setMunicipality }
}
