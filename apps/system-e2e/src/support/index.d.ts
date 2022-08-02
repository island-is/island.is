// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

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

enum ApplicationType {
  pSign = 'p-merki',
  parentalLeave = 'faedingarorlof',
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
    idsLogin({ phoneNumber: string, url: string }): Chainable<void>
    cognitoLogin(): Chainable<void>
    patchSameSiteCookie(interceptUrl: string): void
    pathUuid(): Chainable<string>
    gqlRequest(
      op: string,
      query: string | DocumentNode,
    ): Chainable<Cypress.Response>
  }
}
