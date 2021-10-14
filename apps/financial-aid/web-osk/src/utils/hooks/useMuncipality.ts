import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { GetMunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Municipality } from '@island.is/financial-aid/shared/lib'

interface MunicipalityData {
  municipality: Municipality
}

const useMuncipality = () => {
  const storageKey = 'currentMuncipality'

  const [municipality, setMunicipality] = useState<Municipality>()

  const { data } = useQuery<MunicipalityData>(GetMunicipalityQuery, {
    variables: { input: { id: 'hfj' } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    setMunicipality(storedState)
  }, [])

  useEffect(() => {
    if (data && municipality === undefined) {
      setMunicipality(data.municipality)
      // Watches the user state and writes it to local storage on change
      sessionStorage.setItem(storageKey, JSON.stringify(data.municipality))
    }
  }, [data, municipality])

  return municipality
}

export default useMuncipality
