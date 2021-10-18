import { useEffect, useState } from 'react'

import { GetMunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { useLazyQuery } from '@apollo/client'

interface MunicipalityData {
  municipality: Municipality
}

const useMunicipality = () => {
  const storageKey = 'currentMunicipality'

  const [municipality, _setMunicipality] = useState<Municipality>()

  const [getMunicipality] = useLazyQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data: { municipality: Municipality }) => {
        console.log(data)
        _setMunicipality(municipality)
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
    _setMunicipality(storedState)
  }, [])

  const setMunicipality = async (municipalityId: string) => {
    getMunicipality({
      variables: { input: { id: municipalityId } },
    })
  }

  return { municipality, setMunicipality }
}

export default useMunicipality
