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
  CurrentUserQuery: { fixture: 'currentUserQuery' },
  getNationalRegistryUserQuery: { fixture: 'nationalRegistryUserQuery' },
  GetMunicipalityQuery: { fixture: 'municipalityQuery' },
  createApplication: { fixture: 'createApplicationMutation' },
  gatherTaxDataQuery: { fixture: 'gatherTaxDataQuery' },
}

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  return getFixtureFromRequest[graphqlRequest.body.operationName]
}

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  })
})
