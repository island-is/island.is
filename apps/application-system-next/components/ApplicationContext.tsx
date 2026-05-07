'use client'

import React, { createContext, useContext } from 'react'

interface ApplicationContextValue {
  applicationId: string
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null)

interface ApplicationContextProviderProps {
  applicationId: string
  children: React.ReactNode
}

export const ApplicationContextProvider = ({
  applicationId,
  children,
}: ApplicationContextProviderProps) => (
  <ApplicationContext.Provider value={{ applicationId }}>
    {children}
  </ApplicationContext.Provider>
)

export const useApplicationId = (): string => {
  const ctx = useContext(ApplicationContext)
  if (!ctx) {
    throw new Error(
      'useApplicationId must be used inside an ApplicationContextProvider',
    )
  }
  return ctx.applicationId
}
