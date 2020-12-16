describe('judicial-system-web', () => {
  beforeEach(() => cy.visit('/gaesluvardhaldskrofur'))

  it('should display login message', () => {
    cy.visit('/')
    cy.contains('Innskráning')
  })

  it('should display detention requests', () => {
    cy.visit('/gaesluvardhaldskrofur')
  })
})
