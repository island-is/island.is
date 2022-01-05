// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to stub responses from the API
     * @example cy.stubAPIResponses()
     */
    stubAPIResponses(): Chainable<Element>

    /**
     * Custom command to get by test-id
     * @example cy.getByTestid('some-testid')
     */
    getByTestid(selector: string): Chainable<Element>

    /**
     * Custom command to set the csfr token. This authenticates a user
     * @example cy.login()
     */
    login(): Chainable<Element>

    /**
     * Custom command to click outside a selected element
     * @example cy.clickOutside()
     */
    clickOutside(): Chainable<Element>
  }
}
