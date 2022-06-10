describe('web', () => {
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
})
