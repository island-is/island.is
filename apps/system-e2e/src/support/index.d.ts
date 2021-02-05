// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log into github
     * @example cy.login()
     */
    login(): Chainable<Element>
  }
}
