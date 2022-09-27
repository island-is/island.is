// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL_PREFIX: string
    TEST_ENVIRONMENT: TestEnvironment
    AWS_COGNITO_USERNAME?: string
    AWS_COGNITO_PASSWORD?: string
  }
}

declare namespace Cypress {
  interface Cypress {
    env(
      key: 'cognito',
    ): {
      username: string
      password: string
    }
    env(key: 'authUrl'): AuthUrl
    env(key: 'testEnvironment'): Environment
    env(key: 'basePrefix'): string
    config(key: 'baseUrl'): BaseUrl
  }

  interface Chainable {
    /**
     * Custom command to log in using cognito and island.is SSO
     * @example cy.login()
     */
    idsLogin(params: IDSLogin): Chainable<void>
    cognitoLogin(params?: CognitoCreds): Chainable<void>
    getEnvironmentUrls(authUrl: AuthUrl)
    patchSameSiteCookie(
      interceptUrl: string,
      method: 'GET' | 'POST' = 'GET',
    ): void
    pathUuid()
    bypassApplicationFluff()
  }
}
