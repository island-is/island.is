import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import {
  CREATE_INDICTMENT_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3333/api/graphql',
  name: 'judicial-system-web-e2e-client',
})

describe(CREATE_INDICTMENT_ROUTE, () => {
  let caseId = ''

  before(() => {
    // TODO: Reuse mutation
    cy.intercept(
      'GET',
      '**/api/nationalRegistry/getPersonByNationalId**',
      (req) => {
        req.reply({ fixture: 'nationalRegistryPersonResponse' })
      },
    ).as('getPersonByNationalId')

    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009').then(
      () => {
        cy.wrap(
          client.mutate({
            mutation: gql`
              mutation CreateCaseMutation($input: CreateCaseInput!) {
                createCase(input: $input) {
                  id
                }
              }
            `,
            fetchPolicy: 'no-cache',
            variables: {
              input: {
                type: CaseType.CHILD_PROTECTION_LAWS,
                description: 'Test',
                policeCaseNumbers: ['007-2020-0001'],
                defenderName: 'Test',
                defenderNationalId: '0000000000',
                defenderEmail: 'ivaro@kolibri.is',
                defenderPhoneNumber: '0000000',
                sendRequestToDefender: false,
                leadInvestigator: 'asd',
              },
            },
          }),
        ).then((data: any) => {
          caseId = data.data.createCase.id

          cy.visit(
            `http://localhost:4200/${INDICTMENTS_OVERVIEW_ROUTE}/${caseId}`,
          )
        })
      },
    )
  })

  after(() => {
    cy.wrap(
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
            transition: CaseTransition.DELETE,
            modified: new Date().toISOString(),
          },
        },
        fetchPolicy: 'no-cache',
      }),
    ).then((data: any) => {
      console.log('DELETED', data)
    })
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').should('not.be.disabled')

    // // Police case number
    // cy.get('#policeCaseNumbers').type('0').type('{enter}')
    // cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 0)
    // cy.get('#policeCaseNumbers').clear().blur()
    // cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    // cy.get('#policeCaseNumbers').type('007202201').type('{enter}')
    // cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 1)
    // cy.getByTestid('inputErrorMessage').should('not.exist')
    // cy.getByTestid('continueButton').should('be.disabled')

    // // National id
    // cy.getByTestid('nationalId').type('0').blur()
    // cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    // cy.getByTestid('nationalId').clear().blur()
    // cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    // cy.getByTestid('nationalId').clear().type('0000000000')
    // cy.wait('@getPersonByNationalId')
    // cy.getByTestid('inputErrorMessage').should('not.exist')
    // cy.getByTestid('continueButton').should('be.disabled')

    // // Case type
    // cy.getByTestid('select-case-type').click()
    // cy.get('[id="react-select-case-type-option-1"]').click()
    // cy.getByTestid('continueButton').should('not.be.disabled')
  })
})
