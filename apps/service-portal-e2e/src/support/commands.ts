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

type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

const getFixtureFromRequest: KeyMapping<string, { fixture: string }> = {
  GetUserProfile: { fixture: 'getUserProfileQuery' },
}

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('GetUserProfile')) {
      return {
        fixture: 'getUserProfileQuery',
      }
    }
  }
}

Cypress.Commands.add('stubAPIResponses', () => {
  /**
   * This is currently seems to not work with mock data,
   * could be resolved when this is resolved: https://github.com/mswjs/msw/issues/374
   * */
  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  }).as('DataApi')
})

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})
