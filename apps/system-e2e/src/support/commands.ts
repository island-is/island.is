const testEnvironment = Cypress.env('testEnvironment')
const getAuthDomain = () => {
  const { authDomain } = Cypress.env(testEnvironment)
  return `https://${authDomain}`
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

Cypress.Commands.add('idsLogin', ({ phoneNumber, authDomain }) => {
  cy.patchSameSiteCookie(`${getAuthDomain()}/login/app?*`)
  const sentArgs = {
    args: { phoneNumber: phoneNumber },
  }
  cy.origin(authDomain, sentArgs, ({ phoneNumber }) => {
    cy.get('input[id="phoneUserIdentifier"]').type(phoneNumber)
    cy.get('button[id="submitPhoneNumber"]').click()
  })
})

Cypress.Commands.add('cognitoLogin', ({ cognitoUsername, cognitoPassword }) => {
  if (testEnvironment === 'staging' || testEnvironment === 'dev') {
    cy.session([cognitoUsername, cognitoPassword], () => {
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
    })
  }
})
