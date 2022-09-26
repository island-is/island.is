xdescribe('air-discount-scheme-web', () => {
  beforeEach(() => cy.visit('/'))

  it('should display welcome message', () => {
    cy.get('h1').contains('Loftbrú')
  })
})
