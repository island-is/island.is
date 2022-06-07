const authDomain = 'identity-server.dev01.devland.is/'
const testEnvironment = Cypress.env('testEnvironment')

Cypress.Commands.add(
  'login',
  ({ cognitoUsername, cognitoPassword, phoneNumber }) => {
    cy.session([cognitoUsername, cognitoPassword, phoneNumber], () => {
      if (testEnvironment !== 'prod' && testEnvironment !== 'dev') {
        cy.log("Expecting cognito; testEnvironment:", testEnvironment)
        cy.session([cognitoUsername, cognitoPassword], () => {
          cy.visit('/innskraning')

          cy.get('form[name="cognitoSignInForm"]').as('cognito')

          // Cognito sign-in
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

      // Island.is login
      cy.visit('/minarsidur')

      cy.origin(authDomain, { args: { phoneNumber } }, ({ phoneNumber }) => {
        cy.get('input[id="phoneUserIdentifier"]').type(phoneNumber)
        cy.get('button[id="submitPhoneNumber"]').click()
      })

      cy.url().should(
        'match',
        new RegExp(`${Cypress.config().baseUrl}/minarsidur/?`),
      )
    })
  },
)
