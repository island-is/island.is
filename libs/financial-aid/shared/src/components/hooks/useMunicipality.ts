import { useEffect, useState } from 'react'

import { MunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { useLazyQuery } from '@apollo/client'

interface MunicipalityData {
  municipality: Municipality
}

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
