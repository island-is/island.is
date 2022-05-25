// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { UserRole } from '@island.is/judicial-system/types'
import { CyHttpMessages } from 'cypress/types/net-stubbing'

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('TransitionCaseMutation')) {
      return {
        fixture: 'transitionCaseMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('SendNotificationMutation')) {
      return {
        fixture: 'sendNotificationMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('CurrentUserQuery')) {
      if (
        graphqlRequest.headers.cookie.includes(UserRole.JUDGE) ||
        graphqlRequest.headers.cookie.includes(UserRole.REGISTRAR)
      ) {
        return { fixture: 'judgeUser' }
      } else if (graphqlRequest.headers.referer.includes('/domur')) {
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
    } else if (
      graphqlRequest.body.query.includes('RequestRulingSignatureMutation')
    ) {
      graphqlRequest.alias = 'gqlRequsestSignatureMutation'

      return { fixture: 'requestRulingSignatureMutationResponse' }
    } else if (
      graphqlRequest.body.query.includes('RulingSignatureConfirmationQuery')
    ) {
      graphqlRequest.alias = 'gqlSignatureConfirmationResponse'

      return { fixture: 'rulingSignatureConfirmationResponse' }
    } else if (graphqlRequest.body.query.includes('InstitutionsQuery')) {
      graphqlRequest.alias = 'gqlInstitutionsQuery'

      return { fixture: 'institutionsQueryResponse' }
    }
  }
}

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept(
    'GET',
    '**/api/nationalRegistry/getBusinessesByNationalId**',
    (req) => {
      req.reply({ fixture: 'nationalRegistryBusinessesResponse' })
    },
  ).as('getBusinessesByNationalId')

  cy.intercept(
    'GET',
    '**/api/nationalRegistry/getPersonByNationalId**',
    (req) => {
      req.reply({ fixture: 'nationalRegistryPersonResponse' })
    },
  ).as('getPersonByNationalId')

  cy.intercept('GET', '**/api/lawyers', (req) => {
    req.reply({ fixture: 'lawyersResponse' })
  }).as('lawyers')

  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  })
})

Cypress.Commands.add('login', (userRole?: UserRole) => {
  cy.setCookie(
    'judicial-system.csrf',
    `test-csrf-token${userRole ? `-${userRole}` : ''}`,
  )
})

Cypress.Commands.add('getByTestid', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

// Credit: https://stackoverflow.com/a/65561176
Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})
