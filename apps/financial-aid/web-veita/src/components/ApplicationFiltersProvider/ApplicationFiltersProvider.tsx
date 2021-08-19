import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useState } from 'react'
import { ApplicationFilters } from '@island.is/financial-aid/shared'

import { GetApplicationsFiltersQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

interface ApplicationFiltersData {
  filters?: ApplicationFilters
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
  const [
    applicationFilters,
    setApplicationFilters,
  ] = useState<ApplicationFilters>(initialState)

  const { data, error, loading } = useQuery<ApplicationFiltersData>(
    GetApplicationsFiltersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  console.log(data)

  // useEffect(() => {
  //   console.log('data is chaning', data)
  //   // if (data?.applications) {
  //   //   Object.keys(applicationFilters).forEach((name: string, index) => {
  //   //     setApplicationFilters((preState) => ({
  //   //       ...preState,
  //   //       [name]: data.applications?.filter((el) => [name].includes(el?.state))
  //   //         .length,
  //   //     }))
  //   //   })
  //   // }
  // }, [data])

  return (
    <ApplicationFiltersContext.Provider
      value={{ applicationFilters, setApplicationFilters }}
    >
      {children}
    </ApplicationFiltersContext.Provider>
  )
}

export default ApplicationFiltersProvider
