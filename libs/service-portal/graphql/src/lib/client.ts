import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'

import { authLink } from '@island.is/auth/react'
import {
  getOrganizationSlugFromError,
  ServiceErrorStoreState,
} from '@island.is/portals/core'
import { getStaticEnv } from '@island.is/shared/utils'

const uri =
  getStaticEnv('SI_PUBLIC_GRAPHQL_API') ?? 'http://localhost:4444/api/graphql'

const httpLink = new HttpLink({
  uri: ({ operationName }) => `${uri}?op=${operationName}`,
  fetch,
})

const retryLink = new RetryLink()

type ServiceErrorCallback = ServiceErrorStoreState['setServiceError']

const createErrorLink = (setServiceError?: ServiceErrorCallback) =>
  onError((error) => {
    const { graphQLErrors, networkError, operation } = error

    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )

    if (networkError) console.log(`[Network error]: ${networkError}`)

    // This field is set in the context of the operation itself, i.e. query, mutation, etc.
    // It is used to skip the toast error message, only when the component wants to handle the error itself.
    // However, we only want to display the toast if the error is with organizationSlug field in the error.
    const skipToastError = operation.getContext().skipToastError

    if (setServiceError && !skipToastError) {
      const organizationSlug = getOrganizationSlugFromError(error)

      if (organizationSlug) {
        setServiceError(organizationSlug)
      }
    }
  })

export const createApolloClient = (setServiceError?: ServiceErrorCallback) =>
  new ApolloClient({
    link: ApolloLink.from([
      retryLink,
      createErrorLink(setServiceError),
      authLink,
      httpLink,
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        UserProfile: {
          keyFields: ['nationalId'],
        },
        AuthProcuringHolderDelegation: {
          keyFields: ['from', ['nationalId']],
        },
        AuthLegalGuardianDelegation: {
          keyFields: ['from', ['nationalId']],
        },
        Query: {
          fields: {
            authDelegations: {
              merge(_, incoming) {
                return incoming
              },
            },
          },
        },
      },
    }),
  })
