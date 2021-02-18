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

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): void
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password)
})

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept('POST', '/api/graphql', (req) => {
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

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  console.log(graphqlRequest)
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('CasesQuery')) {
      return {
        fixture: 'cases',
      }
    } else if (
      graphqlRequest.body.hasOwnProperty('variables') &&
      graphqlRequest.body.query.includes('CaseQuery')
    ) {
      if (graphqlRequest.body.variables.input.id === 'test_id') {
        return {
          fixture: 'case',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_stadfesta'
      ) {
        return {
          fixture: 'confirmCase',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_stadfest'
      ) {
        return {
          fixture: 'confirmedCaseJudge',
        }
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
      return { fixture: 'updateCaseMutationResponse' }
    }
  }
}

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
