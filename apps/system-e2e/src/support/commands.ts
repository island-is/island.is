import { DocumentNode, operationName } from '@apollo/client'
import { uuid } from 'uuidv4'

console.log(`Cypress config env: ${JSON.stringify(Cypress.env())}`)
const testEnvironment = Cypress.env('testEnvironment')
const apiUrl = Cypress.env('apiUrl')
const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
const { baseUrl } = Cypress.config()
const { cognitoUsername, cognitoPassword } = Cypress.env()

const cognitoLogin = (creds: CognitoCreds) => {
  const { cognitoUsername, cognitoPassword } = creds
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

const idsLogin = (phoneNumber: string, urlPath: string) => {
  const sentArgs = {
    args: {
      phoneNumber: phoneNumber,
      authUrl: authUrl,
    },
  }
  cy.patchSameSiteCookie(`${authUrl}/login/app?*`)
  cy.visit(urlPath, { log: true })
  cy.origin(authUrl, sentArgs, ({ phoneNumber }) => {
    cy.get('input[id="phoneUserIdentifier"]').type(phoneNumber)
    cy.get('button[id="submitPhoneNumber"]').click()
  })
  cy.url().should('contain', `${Cypress.config().baseUrl}${urlPath}`)
}

Cypress.Commands.add('patchSameSiteCookie', (interceptUrl) => {
  cy.intercept(interceptUrl, (req) => {
    req.on('response', (res) => {
      if (!res.headers['set-cookie']) {
        return
      }
      const disableSameSite = (headerContent: string): string => {
        return headerContent.replace(/samesite=(lax|strict)/gi, 'samesite=none')
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
})

Cypress.Commands.add('idsLogin', ({ phoneNumber, url = '/' }) => {
  if (testEnvironment !== 'local') {
    cy.session('idsLogin', () => {
      cy.session('cognitoLogin', () =>
        cognitoLogin({ cognitoUsername, cognitoPassword }),
      )
      idsLogin(phoneNumber, url)
    })
  } else {
    cy.session('idsLogin', () => {
      idsLogin(phoneNumber, url)
    })
  }
})

Cypress.Commands.add('cognitoLogin', () => {
  cy.log(`testEnvironment: ${Cypress.env('testEnvironment')}`)
  cy.log(`baseUrl: ${Cypress.config().baseUrl}`)

  if (testEnvironment !== 'local') {
    cy.session('cognitoLogin', () => {
      cognitoLogin({ cognitoUsername, cognitoPassword })
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

Cypress.Commands.add('gqlRequest', ({ query }) => {
  const body = {
    //operationName: operationName,
    query: query,
  }
  return cy.request({
    url: `${apiUrl}/graphql`,
    body: body,
    method: 'POST',
  })
})
