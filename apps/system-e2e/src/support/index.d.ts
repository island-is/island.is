// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using cognito and island.is SSO
     * @example cy.login()
     */
    login({
      cognitoUsername: string,
      cognitoPassword: string,
      phoneNumber: string,
    }): Chainable<void>
  }
}
