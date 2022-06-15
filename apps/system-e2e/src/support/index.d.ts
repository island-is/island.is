// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using cognito and island.is SSO
     * @example cy.login()
     */
    getAllCookies(): Chainable<void>
    idsLogin({ phoneNumber: string }): Chainable<void>
    cognitoLogin({
      cognitoUsername: string,
      cognitoPassword: string,
    }): Chainable<void>
    patchSameSiteCookie(interceptUrl?: string): void
  }
}
