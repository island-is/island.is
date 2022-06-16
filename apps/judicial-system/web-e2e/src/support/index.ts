/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// load type definitions that come with Cypress module
/// <reference types="cypress" />

import { UserRole } from '@island.is/judicial-system/types'

import './commands'

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

declare global {
  namespace Cypress {
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
      login(userRole?: UserRole): Chainable<Element>

      /**
       * Custom command to click outside a selected element
       * @example cy.clickOutside()
       */
      clickOutside(): Chainable<Element>
    }
  }
}
