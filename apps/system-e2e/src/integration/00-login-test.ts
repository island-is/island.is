Cypress.config(
  'baseUrl',
  `https://beta.${Cypress.env('testEnvironment')}01.devland.is`,
)

describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({
      cognitoUsername: Cypress.env('COGNITO_USERNAME') ?? '',
      cognitoPassword: Cypress.env('COGNITO_PASSWORD') ?? '',
      phoneNumber: Cypress.env('PHONE_NUMBER') ?? '',
    })
  })
  it('test login', () => {
    cy.visit('/minarsidur/')
    cy.contains('Velkomin')
  })
})
