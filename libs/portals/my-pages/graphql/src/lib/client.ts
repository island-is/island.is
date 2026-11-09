import {
  ApolloClient,
  ApolloLink,
  FieldMergeFunction,
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

const mergeCursorPage: FieldMergeFunction = (
  existing,
  incoming,
  { args, readField },
) => {
  if (!existing || !args?.input?.after) {
    return incoming
  }
  // Rows can shift between pages when the underlying list changes
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
}

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
        // The same counterparty can appear in both incoming and outgoing lists.
        keyFields: ['nationalId', 'type', 'direction'],
      },
      // Health Questionnaire Question: composite key because
      // questions from different sections can share the same id
      QuestionnaireQuestion: {
        keyFields: ['id', 'sectionId'],
      },
      EducationPrimarySchoolStudent: {
        fields: {
          hasKeyInfo: {
            // The primary-school key-info sections are read with errorPolicy
            // 'all', which writes a failed field to the cache as null. This
            // field is also what the student hub decides on, and it is read
            // there by a query of its own: a failure on one of the two reads
            // must not turn the other one's "yes, MMS has this child" into
            // "no child, nothing to show". Null means unknown, so it is
            // dropped; a real `false` still overwrites. The trailing `null`
            // keeps the field present in the cache when there is nothing to
            // fall back to, so the read stays complete rather than partial.
            merge: (existing, incoming) => incoming ?? existing ?? null,
          },
        },
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
            merge: mergeCursorPage,
          },
          healthDirectoratePaginatedAppointments: {
            keyArgs: ['input', ['from', 'to', 'status', 'order', 'limit']],
            merge: mergeCursorPage,
          },
        },
      },
    },
  }),
})
