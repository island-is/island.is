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
    cy.get('[data-testid="featured-link"]').click({
      multiple: true,
    })
  })
  it('should toggle mega-menu', () => {
    cy.get('[data-testid="frontpage-burger-button"]').click({ force: true })
    // cy.get('[data-testid="mega-menu-link"] > a').click({
    //   multiple: true,
    //   force: true,
    // })
  })
  it('should click mega-menu main links', () => {
    cy.get('[data-testid="frontpage-burger-button"]').click({ force: true })
    // cy.get('[data-testid="mega-menu-link"] > a').click({
    //   multiple: true,
    //   force: true,
    // })
  })
})
