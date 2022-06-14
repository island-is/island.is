describe('Home page', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })
  it('should navigate homepage', () => {
    cy.visit('/')
    cy.contains('Að eignast barn')
  })
  it('should have life events', () => {
    cy.visit('/')
    cy.get('a:has([data-testid="lifeevent-card"])')
      .should('have.length.at.least', 3)
      .each((link) => cy.visit(link.attr('href')!))
  })

  it('should have link on life events pages to navigate back to the main page', () => {
    cy.visit('/')
    cy.get('a:has([data-testid="lifeevent-card"])')
      .should('have.length.at.least', 3)
      .each((link) =>
        cy
          .visit(link.attr('href')!)
          .location('pathname', { timeout: 5000 })
          .should('not.equal', '/')
          .get('[data-testid="link-back-home"]')
          .click()
          .location('pathname', { timeout: 5000 })
          .should('equal', '/'),
      )
  })
})
