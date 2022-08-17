//import '@testing-library/cypress/add-commands'
import { getBaseUrl } from './utils'

const testEnvironment = Cypress.env('testEnvironment') as TestEnvironment
const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
const baseUrl = getBaseUrl(Cypress.config())

const cognitoLogin = ({ cognitoUsername, cognitoPassword }: CognitoCreds) => {
  cy.visit('/innskraning')
  cy.get('form[name="cognitoSignInForm"]').as('cognito')
  cy.get('@cognito')
    .get('input[id="signInFormUsername"]')
    .filter(':visible')
    .type(cognitoUsername)
  cy.get('@cognito')
    .get('input[id="signInFormPassword"]')
    .filter(':visible')
    .type(cognitoPassword)
  cy.get('@cognito')
    .get('input[name="signInSubmitButton"]')
    .filter(':visible')
    .click()
  cy.url().should('contain', baseUrl)
}

const idsLogin = ({ phoneNumber, urlPath }: IDSLogin) => {
  const sentArgs = {
    args: {
      phoneNumber: phoneNumber,
    },
  }

  cy.patchSameSiteCookie(`${baseUrl}/api/auth/signin/identity-server?`, 'POST')
  cy.patchSameSiteCookie(`${authUrl}/login/phone?*`)
  cy.visit(urlPath)

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

Cypress.Commands.add('idsLogin', ({ phoneNumber, urlPath = '/' }) => {
  if (testEnvironment !== 'local') {
    const { cognitoUsername, cognitoPassword } = Cypress.env('')

    cy.session('idsLogin', () => {
      cy.session('cognitoLogin', () =>
        cognitoLogin({ cognitoUsername, cognitoPassword }),
      )
      idsLogin({ phoneNumber, urlPath })
    })
  } else {
    cy.session('idsLogin', () => {
      idsLogin({ phoneNumber, urlPath })
    })
  }
})

Cypress.Commands.add('cognitoLogin', ({ cognitoUsername, cognitoPassword }) => {
  if (testEnvironment !== 'local') {
    cy.session('cognitoLogin', () => {
      cognitoLogin({ cognitoUsername, cognitoPassword })
    })
  } else {
    cy.log('skipLogin', 'On localhost, skip Cognito login')
  }
})
