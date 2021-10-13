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
    if (graphqlRequest.body.query.includes('CasesQuery')) {
      return {
        fixture: 'cases',
      }
    } else if (graphqlRequest.body.query.includes('TransitionCaseMutation')) {
      return {
        fixture: 'transitionCaseMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('SendNotificationMutation')) {
      return {
        fixture: 'sendNotificationMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('CurrentUserQuery')) {
      if (graphqlRequest.headers.referer.includes('/domur')) {
        return { fixture: 'judgeUser' }
      } else {
        return { fixture: 'prosecutorUser' }
      }
    } else if (graphqlRequest.body.query.includes('UsersQuery')) {
      if (graphqlRequest.headers.referer.includes('/domur')) {
        return {
          fixture: 'judgeUsers',
        }
      } else {
        return {
          fixture: 'prosecutorUsers',
        }
      }
    } else if (graphqlRequest.body.query.includes('UpdateCaseMutation')) {
      graphqlRequest.alias = 'gqlUpdateCaseMutatation'

      return { fixture: 'updateCaseMutationResponse' }
    } else if (graphqlRequest.body.query.includes('RequestSignatureMutation')) {
      graphqlRequest.alias = 'gqlRequsestSignatureMutation'

      return { fixture: 'requestSignatureMutationResponse' }
    } else if (
      graphqlRequest.body.query.includes('SignatureConfirmationQuery')
    ) {
      graphqlRequest.alias = 'gqlSignatureConfirmationResponse'

      return { fixture: 'signatureConfirmationResponse' }
    } else if (graphqlRequest.body.query.includes('InstitutionsQuery')) {
      graphqlRequest.alias = 'gqlInstitutionsQuery'

      return { fixture: 'institutionsQueryResponse' }
    }
  }
}

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  })
})

Cypress.Commands.add('getByTestid', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

// Credit: https://stackoverflow.com/a/65561176
Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})
