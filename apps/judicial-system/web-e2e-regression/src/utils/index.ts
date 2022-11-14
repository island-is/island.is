import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

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
    .visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
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
            sendRequestToDefender: false,
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
  client.mutate({
    mutation: gql`
      mutation TransitionCaseMutation($input: TransitionCaseInput!) {
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
  })
}
