import { useEffect, useState } from 'react'

import { GetMunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { useLazyQuery } from '@apollo/client'

interface MunicipalityData {
  municipality: Municipality
}

export const useMunicipality = () => {
  const storageKey = 'currentMunicipality'

  const [municipality, setScopedMunicipality] = useState<Municipality>()

  const [getMunicipality] = useLazyQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data: { municipality: Municipality }) => {
        setScopedMunicipality(data.municipality)
      },
      onError: (error) => {
        // TODO: What should happen here?
        console.log(error)
      },
    },
  )

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    setScopedMunicipality(storedState)
  }, [])

  const setMunicipality = async (municipalityId: string) => {
    getMunicipality({
      variables: { input: { id: municipalityId } },
    })
  }

  return { municipality, setMunicipality }
}
