const testEnviron = Cypress.env('testEnvironment')

const cookieName = `_oauth2_${testEnviron}`
const authDomain = 'identity-server.dev01.devland.is/'
const cognitoDomain = 'cognito.shared.devland.is/'

Cypress.Commands.add('ensureLoggedIn', ({cognitoUsername, cognitoPassword, phoneNumber}) => {
  const args = { username: cognitoUsername, password: cognitoPassword, phoneNumber }
  cy.session(
    args,
    () => {
      cy.visit('/innskraning')

      cy.get('form[name="cognitoSignInForm"]').as('cognito')


      // Cognito sign-in
      cy.get('@cognito').get('input[id="signInFormUsername"]').filter(':visible').type(args.username)
      cy.get('@cognito').get('input[id="signInFormPassword"]').filter(':visible').type(args.password)
      cy.get('@cognito').get('input[name="signInSubmitButton"]').filter(':visible').click()

      // Island.is login
      cy.contains('Innskráning').find('button').click()

      cy.origin(authDomain, { args }, ({ username, password }) => {
        cy.contains('Username').find('input').type(username)
        cy.contains('Password').find('input').type(password)
        cy.get('button').contains('Login').click()
      })
      cy.url().should('contain', '/home')
    },
    {
      validate() {
        cy.request('/api/user').its('status').should('eq', 200)
      },
    }
  )
})
