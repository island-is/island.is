describe('Front page', () => {
  const visitOptions = { headers: { 'Accept-Encoding': 'gzip, deflate' } }
  beforeEach(() => {
    cy.cognitoLogin()
  })

  it('has expected sections', () => {
    cy.visit('/', visitOptions)
    cy.contains('Öll opinber þjónusta á einum stað')
    cy.get('[data-testid="home-banner"]').should('have.length', 1)
    cy.get('[data-testid="home-heading"]').should('have.length', 1)
    cy.get('[data-testid="home-news"]').should('have.length', 1)
  })

  it('should have life events', () => {
    cy.visit('/', visitOptions)
    cy.get('[data-testid="lifeevent-card"]')
      .should('have.length.at.least', 3)
      .each((link) => {
        cy.visit(link.prop('href'), visitOptions)
      })
  })

  it('should navigate to featured link', () => {
    cy.visit('/', visitOptions)
    cy.get('[data-testid="featured-link"]')
      .should('have.length.at.least', 3)
      .each((link) => cy.visit(link.prop('href'), visitOptions))
  })

  it('should have link on life events pages to navigate back to the main page', () => {
    const locationOptions = { log: true, timeout: 7000 }
    cy.visit('/', visitOptions)
    cy.get('[data-testid="lifeevent-card"]')
      .should('have.length.at.least', 3)
      .each((link) => {
        cy.visit(link.prop('href'), visitOptions)
        cy.location('pathname', locationOptions).should('not.equal', '/')

        cy.get('[data-testid="link-back-home"]').click()
        cy.location('pathname', locationOptions).should('equal', '/')
      })
  })

  it('should change welcome message on language toggle', () => {
    cy.visit('/', visitOptions)
    cy.get('h1[data-testid="home-heading"]').then((previousHeading) => {
      cy.get('button[data-testid="language-toggler"]:visible').click()
      cy.location('pathname').should('eq', '/en')
      cy.get('h1[data-testid="home-heading"]').should(
        'not.have.text',
        previousHeading.text(),
      )
    })
  })

  it('should toggle mega-menu', () => {
    cy.visit('/', visitOptions)
    cy.get('[data-testid="frontpage-burger-button"]:nth-child(2)').click()
    cy.get('[data-testid="mega-menu-link"] > a').should(
      'have.length.at.least',
      18,
    )
  })
})
