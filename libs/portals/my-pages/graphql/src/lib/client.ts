import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Reference,
} from '@apollo/client'
import fetch from 'cross-fetch'

import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'

const httpLink = new HttpLink({
  uri: ({ operationName }) => `/bff/api/graphql?op=${operationName}`,
  fetch,
  credentials: 'include',
})

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      UserProfile: {
        keyFields: ['nationalId'],
      },
      NationalRegistryPerson: {
        keyFields: ['nationalId'],
      },
      AuthProcuringHolderDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      AuthLegalGuardianDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      AuthDelegationsGroupedByIdentity: {
        keyFields: ['nationalId', 'type'],
      },
      // Health Questionnaire Question: composite key because
      // questions from different sections can share the same id
      QuestionnaireQuestion: {
        keyFields: ['id', 'sectionId'],
      },
      Query: {
        fields: {
          authDelegations: {
            merge(_, incoming) {
              return incoming
            },
          },
          // Cursor pagination: each filter combination is its own list
          // (the cursor is left out of the key), a page with `after` is
          // appended, and a fetch without it (page one) replaces the list.
          healthDirectoratePaginatedHealthConversations: {
            keyArgs: [
              'input',
              ['status', 'starred', 'search', 'treatmentId', 'limit'],
            ],
            merge(existing, incoming, { args, readField }) {
              if (!existing || !args?.input?.after) {
                return incoming
              }
              // Rows can shift between pages when a new message arrives
              const existingIds = new Set(
                existing.data.map((ref: Reference) => readField('id', ref)),
              )
              return {
                ...incoming,
                data: [
                  ...existing.data,
                  ...incoming.data.filter(
                    (ref: Reference) => !existingIds.has(readField('id', ref)),
                  ),
                ],
              }
            },
          },
        },
      },
    },
  }),
})
