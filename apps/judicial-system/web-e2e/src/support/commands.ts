// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
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
    req.reply((res) => {
      if (
        req.body.hasOwnProperty('query') &&
        req.body.query.includes('CasesQuery')
      ) {
        res.send({
          fixture: 'cases',
        })
      }
    })
  })
})

Cypress.Commands.add('getByTestid', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})
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
