// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using cognito
     * @example cy.loginViaCognito()
     */
    login({
      cognitoUsername: string,
      cognitoPassword: string,
      phoneNumber: string,
    }): Chainable<Element>
  }
}
