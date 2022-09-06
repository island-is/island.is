import { IDSLogin, CognitoCreds } from '../lib/types'
import '@testing-library/cypress/add-commands'

const testEnvironment = Cypress.env('testEnvironment')

const cognitoLogin = ({ username, password }: CognitoCreds) => {
  const baseUrl = Cypress.config('baseUrl')
  cy.visit('/innskraning')
  cy.get('form[name="cognitoSignInForm"]').as('cognito')
  cy.get('@cognito')
    .get('input[id="signInFormUsername"]')
    .filter(':visible')
    .type(username)
  cy.get('@cognito')
    .get('input[id="signInFormPassword"]')
    .filter(':visible')
    .type(password)
  cy.get('@cognito')
    .get('input[name="signInSubmitButton"]')
    .filter(':visible')
    .click()
  cy.url().should('contain', baseUrl)
}

const idsLogin = ({
  phoneNumber,
  authUrl = Cypress.env('authUrl'),
  baseUrl = Cypress.config('baseUrl'),
  urlPath = '/',
}: IDSLogin) => {
  const sentArgs = {
    args: {
      phoneNumber: phoneNumber,
    },
  }

  cy.patchSameSiteCookie(`${baseUrl}/api/auth/signin/identity-server?`, 'POST')
  cy.patchSameSiteCookie(`${authUrl}/login/phone?*`)
  cy.visit(`${baseUrl}${urlPath}`)

  cy.origin(authUrl, sentArgs, ({ phoneNumber }) => {
    // The input field seems to get re-rendered early.
    // Waiting prevents the typed phone number from being removed in the re-render.
    cy.wait(3000)
    cy.get('input[id="phoneUserIdentifier"]').type(phoneNumber)
    cy.get('button[id="submitPhoneNumber"]').click()
  })
  cy.url().should('contain', `${baseUrl}${urlPath}`)
}

Cypress.Commands.add(
  'patchSameSiteCookie',
  (interceptUrl, method: 'GET' | 'POST' = 'GET') => {
    cy.intercept(method, interceptUrl, (req) => {
      req.on('response', (res) => {
        if (!res.headers['set-cookie']) {
          return
        }
        const disableSameSite = (headerContent: string): string => {
          const replacedSameSite = headerContent.replace(
            /samesite=(lax|strict)/gi,
            'samesite=none',
          )
          const results = `${replacedSameSite}; secure`
          return results
        }
        if (Array.isArray(res.headers['set-cookie'])) {
          res.headers['set-cookie'] = res.headers['set-cookie'].map(
            disableSameSite,
          )
        } else {
          res.headers['set-cookie'] = disableSameSite(res.headers['set-cookie'])
        }
      })
    }).as('sameSitePatch')
  },
)

Cypress.Commands.add(
  'idsLogin',
  ({ phoneNumber, authUrl, baseUrl, urlPath = '/' }) => {
    cy.session('idsLogin', () => {
      if (testEnvironment !== 'local') {
        const { username, password } = Cypress.env('cognito')
        cy.session('cognitoLogin', () => cognitoLogin({ username, password }))
      }
      idsLogin({ phoneNumber, authUrl, baseUrl, urlPath })
    })
  },
)

Cypress.Commands.add('cognitoLogin', (credentials = Cypress.env('cognito')) => {
  if (testEnvironment !== 'local') {
    cy.session('cognitoLogin', () => {
      cognitoLogin(credentials)
    })
  } else {
    cy.log('skipLogin', 'On localhost, skip Cognito login')
  }
})

Cypress.Commands.add('pathUuid', () => {
  return cy
    .location('pathname')
    .then((path: string) => path.split('/').pop()?.split('?').shift())
})

Cypress.Commands.add('bypassApplicationFluff', () => {
  cy.intercept('/api/graphql?op=ActorDelegations', {
    body: {
      data: { authActorDelegations: [] },
    },
  })
  cy.intercept('/api/graphql?op=ApplicationApplications', {
    body: {
      data: {
        applicationApplications: [],
      },
    },
  })
})
