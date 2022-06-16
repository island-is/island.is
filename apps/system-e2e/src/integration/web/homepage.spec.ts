describe('Home page', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })

  it('has expected sections', () => {
    cy.visit('/')
    cy.get('[data-testid="home-banner"]').should('have.length', 1)
    cy.get('[data-testid="home-heading"]').should('have.length', 1)
    cy.get('[data-testid="home-news"]').should('have.length', 1)
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
      .each((link) => {
        cy.visit(link.attr('href')!)
        cy.location('pathname', { timeout: 7000 }).should('not.equal', '/')

        cy.get('[data-testid="link-back-home"]').click()
        cy.location('pathname', { timeout: 7000 }).should('equal', '/')
      })
  })
})
