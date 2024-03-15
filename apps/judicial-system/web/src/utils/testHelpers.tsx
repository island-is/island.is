import React, { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'

import { FormContext, UserContext } from '../components'
import { UserRole } from '../graphql/schema'
import { TempCase } from '../types'
import { mockUser } from './mocks'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const IntlProviderWrapper = ({ children }: any) => {
  return (
    <IntlProvider
      locale="is"
      messages={{}}
      onError={(err) => {
        if (err.code === 'MISSING_TRANSLATION') {
          return
        }
        throw err
      }}
    >
      {children}
    </IntlProvider>
  )
}

export const FormContextWrapper = ({
  theCase,
  children,
}: {
  theCase: TempCase
  children?: ReactNode
}) => {
  return (
    <FormContext.Provider
      value={{
        workingCase: theCase,
        setWorkingCase: jest.fn(),
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const UserContextWrapper = ({
  children,
  userRole,
}: {
  children: ReactNode
  userRole: UserRole
}) => {
  return (
    <UserContext.Provider
      value={{
        user: mockUser(userRole),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
