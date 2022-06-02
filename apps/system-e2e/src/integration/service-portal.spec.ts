describe('web', () => {
  beforeEach(() => {
    cy.login({
      cognitoUsername: Cypress.env('COGNITO_USERNAME') ?? '',
      cognitoPassword: Cypress.env('COGNITO_PASSWORD') ?? '',
      phoneNumber: Cypress.env('PHONE_NUMBER') ?? '',
    })
  })
  it('test minarsidur', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
  })
})
