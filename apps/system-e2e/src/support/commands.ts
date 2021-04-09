const testEnviron = Cypress.env('testEnvironment')

const cookieName = `_oauth2_${testEnviron}`

Cypress.Commands.add('ensureLoggedIn', ({ url }) => {
  Cypress.log({
    name: 'ensureLoggedIn',
  })

  return cy
    .request({
      url,
      followRedirect: false,
    })
    .then(({ headers }) => {
      if (headers.location) {
        cy.visit(url)
        cy.get('input[name="username"]:visible').type(
          Cypress.env('cognito_username'),
        )
        cy.get('input[name="password"]:visible').type(
          Cypress.env('cognito_password'),
        )
        cy.get('input[type=Submit]:visible').click()
        cy.getCookie(cookieName).should('exist')
      }
    })
})
