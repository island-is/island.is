// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

interface CypressFn {
  (): Cypress.Chainable<JQuery<HTMLElement>>
}

interface IDSLogin {
  phoneNumber: string
  urlPath: string
}

// NOTE: Copied from the runtime generated scheme at app/air-discount-scheme/web/graphql/schema.tsx
//       Is there a pattern to import generated types?
type User = {
  __typename?: 'User'
  nationalId: Scalars['ID']
  name: Scalars['String']
  mobile?: Maybe<Scalars['String']>
  role: Scalars['String']
  fund?: Maybe<Fund>
  meetsADSRequirements: Scalars['Boolean']
  flightLegs: Array<FlightLeg>
}

type ConnectionDiscountCode = {
  __typename?: 'ConnectionDiscountCode'
  code: Scalars['ID']
  flightId: Scalars['String']
  flightDesc: Scalars['String']
  validUntil: Scalars['String']
}

type Discount = {
  __typename?: 'Discount'
  nationalId: Scalars['ID']
  discountCode: Scalars['String']
  connectionDiscountCodes: Array<ConnectionDiscountCode>
  expiresIn: Scalars['Float']
  user: User
}
// NOTE: end

type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

type TestConfig = {
  authUrl: string
  baseUrl: string
}

type CognitoCreds = {
  cognitoUsername: string
  cognitoPassword: string
}

type FakeChild = {
  name: string
  nationalId: string
}

type FakeUser = {
  name: string
  phoneNumber: string
  nationalId: string
  children: FakeChild[]
}

type EnvConfig = {
  fakeUsers: FakeUser[]
  cognitoUrl: string
  local: TestConfig
  dev: TestConfig
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
    cognitoLogin(params: CognitoCreds): Chainable<void>
    patchSameSiteCookie(
      interceptUrl: string,
      method: 'GET' | 'POST' = 'GET',
    ): void
  }
}
