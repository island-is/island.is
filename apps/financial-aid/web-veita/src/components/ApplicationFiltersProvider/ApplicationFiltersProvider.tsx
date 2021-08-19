import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  Application,
  ApplicationFilters,
} from '@island.is/financial-aid/shared'
import { useRouter } from 'next/router'

import { GetApplicationsQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

interface ApplicationsProvider {
  applications?: Application[]
}

interface ApplicationFiltersProvider {
  applicationFilters?: ApplicationFilters
  setApplicationFilters?: React.Dispatch<
    React.SetStateAction<ApplicationFilters>
  >
}

export const ApplicationFiltersContext = createContext<ApplicationFiltersProvider>(
  {},
)

export const initialState = {
  New: 0,
  InProgress: 0,
  DataNeeded: 0,
  Rejected: 0,
  Approved: 0,
}

interface PageProps {
  children: ReactNode
}

const ApplicationFiltersProvider = ({ children }: PageProps) => {
  const router = useRouter()

  const [
    applicationFilters,
    setApplicationFilters,
  ] = useState<ApplicationFilters>(initialState)

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    GetApplicationsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    console.log('data is chaning', data)
    if (data?.applications) {
      Object.keys(applicationFilters).forEach((name: string, index) => {
        setApplicationFilters((preState) => ({
          ...preState,
          [name]: data.applications?.filter((el) => [name].includes(el?.state))
            .length,
        }))
      })
    }
  }, [data])

  useEffect(() => {
    console.log('route breytist')
  }, [router.route])

  return (
    <ApplicationFiltersContext.Provider
      value={{ applicationFilters, setApplicationFilters }}
    >
      {children}
    </ApplicationFiltersContext.Provider>
  )
}

export default ApplicationFiltersProvider
