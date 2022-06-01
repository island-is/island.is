describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })
  it('should navigate homepage', () => {
    cy.visit('/')
    cy.contains('Að eignast barn')
  })
  xit('should have life events', () => {
    cy.visit('/')
    cy.get('a > [data-cy="lifeevent-card"]').should('have.length.at.least', 3)
  })
})
