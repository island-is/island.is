import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Application } from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'
import { GetMyApplicationQuery } from '@island.is/financial-aid-web/osk/graphql'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GraphQLError } from 'graphql'

interface ApplicationProvider {
  myApplication?: Application
  updateApplication?: any
  initializeFormProvider?: any
  loading: boolean
  fetchError?: GraphQLError[]
}

interface Props {
  children: ReactNode
}

interface ApplicantData {
  myApplication?: Application
}

export const ApplicationContext = createContext<ApplicationProvider>({})

const ApplicationProvider = ({ children }: Props) => {
  const router = useRouter()

  const storageKey = 'myCurrentApplication'

  const [myApplication, updateApplication] = useState<Application>()

  const { data, fetchError, loading } = useQuery<ApplicantData>(
    GetMyApplicationQuery,
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
      updateApplication(data.myApplication)
      // Watches the user state and writes it to local storage on change
      sessionStorage.setItem(storageKey, JSON.stringify(data.myApplication))
    }
  }, [myApplication, data])

  return (
    <ApplicationContext.Provider value={{ myApplication, fetchError, loading }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export default ApplicationProvider
