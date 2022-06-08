describe('Application system form', () => {
  beforeEach(() => {
    cy.login({
      cognito_username: Cypress.env('COGNITO_USERNAME'),
      cognito_password: Cypress.env('COGNITO_PASSWORD'),
      phone_number: Cypress.env('PHONE_NUMBER'),
    })
  })
  describe('p-sign', () => {
    it('should be able to create application', () => {
      cy.visit('/umsoknir/p-merki/')
      cy.contains('Ný umsókn')
      cy.get('button[data-testid="new"]').click()
      cy.get('input[type="checkbox"]').click()
      cy.get('button[type="submit"]').click()
    })
  })
})
