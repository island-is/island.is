// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { CyHttpMessages } from 'cypress/types/net-stubbing'

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('CurrentUserQuery')) {
      return {
        fixture: 'currentUserQuery',
      }
    }
  }
}

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  })
})
