// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

interface CypressFn {
  (): Cypress.Chainable<JQuery<HTMLElement>>
}

interface IDSLogin {
  phoneNumber: string
  urlPath: string
  fn?: CypressFn
}

type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

type TestConfig = {
  authUrl: string
  baseUrl: string
}

type CognitoCreds = {
  cognitoUsername: string
  cognitoPassword: string
}

type FakeUser = {
  name: string
  phoneNumber: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    TEST_ENVIRONMENT: TestEnvironment
    AWS_COGNITO_USERNAME?: string
    AWS_COGNITO_PASSWORD?: string
  }
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using cognito and island.is SSO
     * @example cy.login()
     */
    idsLogin(params: IDSLogin): Chainable<void>
    cognitoLogin(): Chainable<void>
    patchSameSiteCookie(
      interceptUrl: string,
      method: 'GET' | 'POST' = 'GET',
    ): void
  }
}
