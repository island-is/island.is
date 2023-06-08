import { useMutation } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'

import { ApplicationFiltersMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

interface ApplicationFiltersData {
  applicationFilters?: ApplicationFilters
}

interface ApplicationFiltersProvider {
  applicationFilters: ApplicationFilters
  setApplicationFilters: React.Dispatch<
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
  MyCases: 0,
}

export const ApplicationFiltersContext =
  createContext<ApplicationFiltersProvider>({
    applicationFilters: initialState,
    loading: true,
    setApplicationFilters: () => initialState,
  })

interface PageProps {
  children: ReactNode
}

const ApplicationFiltersProvider = ({ children }: PageProps) => {
  const [applicationFilters, setApplicationFilters] =
    useState<ApplicationFilters>(initialState)

  const [applicationFiltersQuery, { loading }] =
    useMutation<ApplicationFiltersData>(ApplicationFiltersMutation, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

  useEffect(() => {
    async function fetchFilters() {
      const { data } = await applicationFiltersQuery()
      if (data?.applicationFilters) {
        setApplicationFilters(data.applicationFilters)
      }
    }
    fetchFilters()
  }, [])

  return (
    <ApplicationFiltersContext.Provider
      value={{ applicationFilters, setApplicationFilters, loading }}
    >
      {children}
    </ApplicationFiltersContext.Provider>
  )
}

export default ApplicationFiltersProvider
