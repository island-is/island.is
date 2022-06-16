const cognitoUsername = Cypress.env('COGNITO_USERNAME')
const cognitoPassword = Cypress.env('COGNITO_PASSWORD')

describe('Home page', () => {
  before(() => {
    cy.cognitoLogin({ cognitoUsername, cognitoPassword })
  })

  it('has expected sections', () => {
    cy.visit('/')
    cy.contains('Öll opinber þjónusta á einum stað')
    cy.get('[data-testid="home-banner"]').should('have.length', 1)
    cy.get('[data-testid="home-heading"]').should('have.length', 1)
    cy.get('[data-testid="home-news"]').should('have.length', 1)
  })

  it('should have life events', () => {
    cy.visit('/')
    cy.get('a:has([data-testid="lifeevent-card"])')
      .should('have.length.at.least', 3)
      .each((link) => {
        cy.visit(link.prop('href'))
      })
  })

  it('should navigate to featured link', () => {
    cy.visit('/')
    cy.get('[data-testid="featured-link"]')
      .should('have.length.at.least', 8)
      .each((link) => cy.visit(link.prop('href')))
  })

  it('should have link on life events pages to navigate back to the main page', () => {
    const locationOptions = { log: true, timeout: 7000 }
    cy.visit('/')
    cy.get('[data-testid="lifeevent-card"]')
      .should('have.length.at.least', 3)
      .each((link) => {
        cy.visit(link.prop('href'))
        cy.location('pathname', locationOptions).should('not.equal', '/')

        cy.get('[data-testid="link-back-home"]').click()
        cy.location('pathname', locationOptions).should('equal', '/')
      })
  })
})
