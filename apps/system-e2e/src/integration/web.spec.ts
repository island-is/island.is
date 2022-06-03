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
  xit('should toggle language', () => {
    // FIXME: cypress spots three button elements, although only one is visible in the dom
    cy.get('[data-testid="language-toggler"]').contains('EN')
    cy.get('[data-testid="language-toggler"]').click()
    cy.get('[data-testid="language-toggler"]').contains('IS')
    cy.contains('Transportation')
  })
  it('should navigate to featured link', () => {
    cy.get('[data-testid="featured-link"]')
      .should('have.length.at.least', 8)
      .each((link) => cy.wrap(link).click())
  })
  it('should show submenu under frontpage megamenu', () => {
    cy.get('[data-testid="frontpage-mega-menu"]')
      .should('have.length.at.least', 18)
      .each((link) => cy.wrap(link).click())
  })
})
