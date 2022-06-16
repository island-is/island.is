describe('Search feature', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })

  it('should have search results for common words', function () {
    const testPhrase = 'umsókn'
    cy.visit('/')
      .get('[data-testid="search-box"]')
      .click()
      .type(`${testPhrase}{enter}`)
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
