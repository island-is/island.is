import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import {
  CaseTransition,
  CaseType,
  RequestSharedWithDefender,
  UpdateCase,
} from '@island.is/judicial-system/types'

import { CreateCaseMutation } from '../graphql/schema'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3333/api/graphql',
  name: 'judicial-system-web-e2e-regression-client',
})

export const loginAndCreateCase = (
  type: CaseType,
  policeCaseNumbers: string[],
) => {
  return cy
    .visit(`http://localhost:4200/api/auth/login?nationalId=0000000009`)
    .then(() =>
      client.mutate<CreateCaseMutation>({
        mutation: gql`
          mutation CreateCase($input: CreateCaseInput!) {
            createCase(input: $input) {
              id
              defendants {
                id
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          input: {
            type,
            description: 'Test',
            policeCaseNumbers,
            defenderName: 'Test',
            defenderNationalId: '0000000000',
            defenderEmail: 'ivaro@kolibri.is',
            defenderPhoneNumber: '0000000',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
            leadInvestigator: 'asd',
          },
        },
      }),
    )
    .then((res) => {
      return cy
        .wrap(res)
        .should('have.property', 'data')
        .then(() => {
          return res.data?.createCase?.id || ''
        })
    })
}

export const transitionCase = (caseId: string, transition: CaseTransition) => {
  return cy.wrap(
    client.mutate({
      mutation: gql`
        mutation TransitionCase($input: TransitionCaseInput!) {
          transitionCase(input: $input) {
            state
          }
        }
      `,
      variables: {
        input: {
          id: caseId,
          transition,
        },
      },
      fetchPolicy: 'no-cache',
    }),
  )
}

export const updateCase = (caseId: string, update: UpdateCase) => {
  return cy.wrap(
    client.mutate({
      mutation: gql`
        mutation UpdateCase($input: UpdateCaseInput!) {
          updateCase(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id: caseId,
          ...update,
        },
      },
      fetchPolicy: 'no-cache',
    }),
  )
}

export const deleteCase = (caseId: string) => {
  client.mutate({
    mutation: gql`
      mutation TransitionCase($input: TransitionCaseInput!) {
        transitionCase(input: $input) {
          state
        }
      }
    `,
    variables: {
      input: {
        id: caseId,
        transition: CaseTransition.DELETE,
      },
    },
    fetchPolicy: 'no-cache',
  })
}
