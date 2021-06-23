import { gql, useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState } from 'react'
import {
  Application,
  UpdateApplication,
  ApplicationState,
  getState,
} from '@island.is/financial-aid/shared'

import { GetApplicationsQuery } from '../../../graphql/sharedGql'

interface ApplicationsProvider {
  applications?: Application[]
}

export const ApplicationsContext = createContext<ApplicationsProvider>({})

const ApplicationsProvider: React.FC = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([])

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    GetApplicationsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    if (data?.applications) {
      setApplications(data?.applications)
    }
  }, [data])

  return (
    <ApplicationsContext.Provider value={{ applications }}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export default ApplicationsProvider
