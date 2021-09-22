import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Municipality } from '@island.is/financial-aid/shared/lib'

import { GetMunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

interface MunicipalityData {
  municipality: Municipality
}

interface MunicipalityProvider {
  municipality?: Municipality
  setMunicipality?: any
}

interface Props {
  children: ReactNode
}

export const MunicipalityContext = createContext<MunicipalityProvider>({})

const MunicipalityProvider = ({ children }: Props) => {
  const [municipality, setMunicipality] = useState<Municipality>()

  const { data } = useQuery<MunicipalityData>(GetMunicipalityQuery, {
    variables: { input: { id: 'hfj' } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data && municipality === undefined) {
      setMunicipality(data.municipality)
    }
  }, [data, municipality])

  return (
    <MunicipalityContext.Provider value={{ setMunicipality, municipality }}>
      {children}
    </MunicipalityContext.Provider>
  )
}

export default MunicipalityProvider
