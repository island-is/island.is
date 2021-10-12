import React, { createContext, ReactNode, useEffect, useState } from 'react'

import { Application, Municipality } from '@island.is/financial-aid/shared/lib'

import {
  GetApplicationQuery,
  GetMunicipalityQuery,
} from '@island.is/financial-aid-web/osk/graphql'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ApolloError } from 'apollo-client'

interface ApplicantData {
  application?: Application
}
interface MunicipalityData {
  municipality: Municipality
}

interface ApplicationProvider {
  myApplication?: Application
  loading: boolean
  error?: ApolloError
  municipality?: Municipality
  setMunicipality?: any
}

interface Props {
  children: ReactNode
}

export const ApplicationContext = createContext<ApplicationProvider>({
  loading: true,
})

const ApplicationProvider = ({ children }: Props) => {
  const router = useRouter()

  const [municipality, setMunicipality] = useState<Municipality>()

  const { data: municipalityData } = useQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      variables: { input: { id: 'hfj' } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const storageKey = 'myCurrentApplication'

  const [myApplication, updateApplication] = useState<Application>()

  const { data, error, loading } = useQuery<ApplicantData>(
    GetApplicationQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    updateApplication(storedState)
  }, [])

  useEffect(() => {
    if (data) {
      updateApplication(data.application)
      // Watches the user state and writes it to local storage on change
      sessionStorage.setItem(storageKey, JSON.stringify(data.application))
    }
  }, [myApplication, data])

  return (
    <ApplicationContext.Provider value={{ myApplication, error, loading }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export default ApplicationProvider
