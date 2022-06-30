import '@testing-library/cypress/add-commands'
const testEnvironment = Cypress.env('testEnvironment')
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

export const idsLogin = ({ phoneNumber, urlPath, fn }: IDSLogin) => {
  const sentArgs = {
    args: {
      phoneNumber: phoneNumber,
      authUrl: authUrl,
      urlPath: `${Cypress.config().baseUrl}${urlPath}`,
    },
  }

  // cy.patchSameSiteCookie(
  //   'http://localhost:4200/api/auth/callback/identity-server?',
  //   'POST',
  // )
  // cy.patchSameSiteCookie(
  //   'http://localhost:4200/api/auth/signin/identity-server?',
  //   'POST',
  // )

  cy.patchSameSiteCookie('http://localhost:4200/api/auth/csrf')
  cy.patchSameSiteCookie('http://localhost:4200/api/auth/providers')
  cy.patchSameSiteCookie('http://localhost:4200/api/auth/session')
  cy.patchSameSiteCookie(`${authUrl}/login/phone/poll`)
  cy.patchSameSiteCookie(`${authUrl}/login/phone/signIn`)
  cy.patchSameSiteCookie(`${authUrl}/login/phone/signIn`, 'POST')
  cy.patchSameSiteCookie(`${authUrl}/login/app?*`)
  cy.patchSameSiteCookie(`${authUrl}/login/phone?*`)
  cy.patchSameSiteCookie(`${authUrl}/login/clientName?*`)
  cy.patchSameSiteCookie(`${authUrl}/login/idprestrictions?*`)

  cy.patchSameSiteCookie(`${authUrl}/login/phone/authenticate`)

  cy.patchSameSiteCookie(
    `http://localhost:4200/api/auth/signin/identity-server?*`,
  )
  cy.patchSameSiteCookie(`http://localhost:4200/api/graphql`)

  cy.patchSameSiteCookie('http://localhost:4200/api/*')

  cy.visit(urlPath)

  cy.origin(authUrl, sentArgs, ({ phoneNumber, urlPath }) => {
    cy.get('input[id="phoneUserIdentifier"]').type(phoneNumber)
    cy.get('button[id="submitPhoneNumber"]').click()
  })
  cy.url().should('contain', `${Cypress.config().baseUrl}${urlPath}`)
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
          console.log(res.headers['set-cookie'])
        } else {
          res.headers['set-cookie'] = disableSameSite(res.headers['set-cookie'])
          console.log(res.headers['set-cookie'])
        }
      })
    }).as('sameSitePatch')
  },
)

Cypress.Commands.add('idsLogin', ({ phoneNumber, urlPath = '/' }) => {
  if (testEnvironment !== 'local') {
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
