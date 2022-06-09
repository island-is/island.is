describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
    cy.visit('/')
  })
  it('should navigate homepage', () => {
    cy.contains('Að eignast barn')
  })
  it('should have life events', () => {
    cy.visit('/')
    cy.get('[data-testid="lifeevent-card"]')
      .should('have.length.at.least', 3)
      .each((link) => cy.wrap(link).click())
  })
  it('should toggle language', () => {
    // FIXME: cypress spots three button elements, although only one is visible in the dom
    cy.get('button[data-testid="language-toggler"][lang="en"]').click()
  })
  it('should navigate to featured link', () => {
    cy.visit('/')
    cy.get('[data-testid="featured-link"]')
      .should('have.length.at.least', 8)
      .each((link) => cy.wrap(link).click())
  })
  it('should toggle mega-menu', () => {
    cy.get('[data-testid="frontpage-burger-button"]:nth-child(2)').click()
    cy.get('[data-testid="mega-menu-link"] > a').should(
      'have.length.at.least',
      18,
    )
  })
})
