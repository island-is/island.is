import { FC, PropsWithChildren, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import { FormContext, UserContext } from '../components'
import { Case, UserRole } from '../graphql/schema'
import { mockUser } from './mocks'

export const IntlProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
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

export const ApolloProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
      {children}
    </ApolloProvider>
  )
}

export const FormContextWrapper: FC<
  PropsWithChildren<{ theCase: Case; children: ReactNode }>
> = ({ theCase, children }) => {
  return (
    <FormContext.Provider
      value={{
        workingCase: theCase,
        setWorkingCase: jest.fn(),
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
        getCase: jest.fn(),
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const UserContextWrapper: FC<
  PropsWithChildren<{ userRole: UserRole; children: ReactNode }>
> = ({ userRole, children }) => {
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
