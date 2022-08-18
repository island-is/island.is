import '@testing-library/cypress/add-commands'
import { IDSLogin, CognitoCreds } from '../lib/types'
const testEnvironment = Cypress.env('testEnvironment')
const authUrl = Cypress.env('authUrl')

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

const idsLogin = ({ phoneNumber, baseUrl, urlPath }: IDSLogin) => {
  const sentArgs = {
    args: {
      phoneNumber: phoneNumber,
    },
  }

  cy.patchSameSiteCookie(`${baseUrl}/api/auth/signin/identity-server?`, 'POST')
  cy.patchSameSiteCookie(`${authUrl}/login/phone?*`)
  cy.visit(`${baseUrl}${urlPath}`)

  cy.origin(authUrl, sentArgs, ({ phoneNumber }) => {
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

Cypress.Commands.add('idsLogin', ({ phoneNumber, baseUrl, password, urlPath = '/' }) => {
  if (testEnvironment !== 'local') {
    cy.login('My password', password)
    const { username, password } = Cypress.env('cognito')

    cy.session('idsLogin', () => {
      cy.session('cognitoLogin', () => cognitoLogin({ username, password }))
      idsLogin({ phoneNumber, baseUrl, urlPath })
    })
  } else {
    cy.session('idsLogin', () => {
      idsLogin({ phoneNumber, baseUrl, urlPath })
    })
  }
})

Cypress.Commands.add('cognitoLogin', ({ username, password }) => {
  if (testEnvironment !== 'local') {
    cy.session('cognitoLogin', () => {
      cognitoLogin({ username, password })
    })
  } else {
    cy.log('skipLogin', 'On localhost, skip Cognito login')
  }
})
