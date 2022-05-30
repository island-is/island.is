Cypress.config(
  'baseUrl',
  `https://beta.${Cypress.env('testEnvironment')}01.devland.is`,
)

describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({
      Cypresss.env('COGNITO_USERNAME'),
      Cypresss.env('COGNITO_PASSWORD'),
      Cypresss.env('PHONE_NUMBER'),
    })
  })
  it('should navigate serviceportal', () => {
    cy.visit('/minarsidur/')
    // TODO: IDS login
    cy.contains('Skráðu þig inn')
  })
})
