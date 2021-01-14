describe('auth-admin-web', () => {
  beforeEach(() => cy.visit('/'))

  it('should display welcome message', () => {
    cy.contains('IDS management')
    cy.contains('Login')
  })
})
