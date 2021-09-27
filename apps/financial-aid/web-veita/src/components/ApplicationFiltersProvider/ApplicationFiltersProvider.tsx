import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'

import { GetApplicationFiltersQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

interface ApplicationFiltersData {
  applicationFilters?: ApplicationFilters
}

interface ApplicationFiltersProvider {
  applicationFilters?: ApplicationFilters
  setApplicationFilters?: React.Dispatch<
    React.SetStateAction<ApplicationFilters>
  >
  loading: boolean
}

export const initialState = {
  New: 0,
  InProgress: 0,
  DataNeeded: 0,
  Rejected: 0,
  Approved: 0,
}

export const ApplicationFiltersContext = createContext<ApplicationFiltersProvider>(
  {
    applicationFilters: initialState,
    loading: true,
  },
)

interface PageProps {
  children: ReactNode
}

const ApplicationFiltersProvider = ({ children }: PageProps) => {
  const [
    applicationFilters,
    setApplicationFilters,
  ] = useState<ApplicationFilters>(initialState)

  const { data, loading } = useQuery<ApplicationFiltersData>(
    GetApplicationFiltersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    if (data?.applicationFilters) {
      setApplicationFilters(data.applicationFilters)
    }
  }, [data])

  return (
    <ApplicationFiltersContext.Provider
      value={{ applicationFilters, setApplicationFilters, loading }}
    >
      {children}
    </ApplicationFiltersContext.Provider>
  )
}

export default ApplicationFiltersProvider
