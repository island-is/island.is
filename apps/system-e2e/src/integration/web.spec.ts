describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })
  it('should navigate homepage', () => {
    cy.visit('/')
    cy.contains('Eignast barn')
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

  it('should have search results for common words', function () {
    cy.visit('/')
      .get('[data-testid="search-box"]')
      .click()
      .type('covid{enter}')
      .get('[data-testid="search-result"]', { timeout: 15000 })
      .as('test-results')
      .should('have.length.at.least', 10)
      .location('pathname', { timeout: 5000 })
      .as('searchPath')
      .get('@test-results')
      .first()
      .click()
      .location('pathname', { timeout: 5000 })
      .should((currentPath) => {
        expect(currentPath).to.not.eq(this.searchPath)
      })
  })

  it('should have no search results for long bogus search words', function () {
    cy.visit('/')
      .get('[data-testid="search-box"]')
      .click()
      .type('abcdefhijklmnopqrstuvwxyz1234567890{enter}')
      .get('[data-testid="search-result"]', { timeout: 5000 })
      .should('have.length', 0)
  })
})
