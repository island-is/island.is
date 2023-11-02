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
import 'cypress-file-upload'

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('TransitionCase')) {
      return {
        fixture: 'transitionCaseMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('SendNotification')) {
      return {
        fixture: 'sendNotificationMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('CurrentUser')) {
      if (
        graphqlRequest.headers.cookie.includes(UserRole.JUDGE) ||
        graphqlRequest.headers.cookie.includes(UserRole.REGISTRAR)
      ) {
        return { fixture: 'judgeUser' }
      } else if (
        graphqlRequest.headers.cookie.includes(UserRole.PRISON_SYSTEM_STAFF)
      ) {
        return { fixture: 'prisonSystemStaffUser' }
      } else if (graphqlRequest.headers.referer.includes('/domur')) {
        return { fixture: 'judgeUser' }
      } else {
        return { fixture: 'prosecutorUser' }
      }
    } else if (graphqlRequest.body.query.includes('Users')) {
      if (graphqlRequest.headers.referer.includes('/domur')) {
        return {
          fixture: 'judgeUsers',
        }
      } else {
        return {
          fixture: 'prosecutorUsers',
        }
      }
    } else if (graphqlRequest.body.query.includes('UpdateCase')) {
      graphqlRequest.alias = 'gqlUpdateCaseMutatation'

      return { fixture: 'updateCaseMutationResponse' }
    } else if (graphqlRequest.body.query.includes('RequestRulingSignature')) {
      graphqlRequest.alias = 'gqlRequsestSignatureMutation'

      return { fixture: 'requestRulingSignatureMutationResponse' }
    } else if (
      graphqlRequest.body.query.includes('RulingSignatureConfirmation')
    ) {
      graphqlRequest.alias = 'gqlSignatureConfirmationResponse'

      return { fixture: 'rulingSignatureConfirmationResponse' }
    } else if (graphqlRequest.body.query.includes('Institutions')) {
      graphqlRequest.alias = 'gqlInstitutionsQuery'

      return { fixture: 'institutionsQueryResponse' }
    } else if (graphqlRequest.body.query.includes('GetTranslations')) {
      graphqlRequest.alias = 'gqlGetTranslations'
      return { fixture: 'translationsResponse' }
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

  cy.intercept('GET', '**/api/lawyers/getLawyers', (req) => {
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
