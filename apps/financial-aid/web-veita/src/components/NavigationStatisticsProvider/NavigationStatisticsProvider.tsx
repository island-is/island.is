import { useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState } from 'react'
import { Application, ApplicationState } from '@island.is/financial-aid/shared'

import { GetApplicationsQuery } from '../../../graphql/sharedGql'

interface ApplicationsProvider {
  applications?: Application[]
}

interface NavigationStatisticsProvider {
  statistics?: Statistics
  setStatistics?: React.Dispatch<React.SetStateAction<Statistics>>
}

interface Statistics {
  New: number
  InProgress: number
  DataNeeded: number
  Rejected: number
  Approved: number
}

export const NavigationStatisticsContext = createContext<NavigationStatisticsProvider>(
  {},
)

export const initialState = {
  New: 0,
  InProgress: 0,
  DataNeeded: 0,
  Rejected: 0,
  Approved: 0,
}

const NavigationStatisticsProvider: React.FC = ({ children }) => {
  const [statistics, setStatistics] = useState<Statistics>(initialState)

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    GetApplicationsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    if (data?.applications) {
      Object.keys(statistics).forEach((name: string, index) => {
        setStatistics((preState) => ({
          ...preState,
          [name]: data.applications?.filter((el) => [name].includes(el?.state))
            .length,
        }))
      })
    }
  }, [data])

  return (
    <NavigationStatisticsContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </NavigationStatisticsContext.Provider>
  )
}

export default NavigationStatisticsProvider
