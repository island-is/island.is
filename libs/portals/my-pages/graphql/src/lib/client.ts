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
      // Key-information lookups carry a title resolved to the locale the query
      // asked for, so they cannot be normalized by `id` alone — switching
      // language would overwrite the shared entity and leave the other
      // language's list pointing at it. The id stays the raw MMS id, which is
      // what writes send back.
      EducationPrimarySchoolRelationType: { keyFields: false },
      EducationPrimarySchoolAllergy: { keyFields: false },
      EducationPrimarySchoolLanguageEnvironment: { keyFields: false },
      EducationPrimarySchoolAgentRelationType: { keyFields: false },
      EducationPrimarySchoolStudent: {
        fields: {
          hasKeyInfo: {
            // Read by two queries (the overview sections and the student hub)
            // with errorPolicy 'all', which caches a failed field as null. Null
            // means unknown, so it is dropped rather than letting one failed
            // read turn the other's "MMS has this child" into "nothing to
            // show"; a real `false` still overwrites. The trailing `null` keeps
            // the field present so the read stays complete.
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
