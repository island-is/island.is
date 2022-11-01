xdescribe('air-discount-scheme-web', () => {
  beforeEach(() => cy.visit('/'))

  xit('should display welcome message', () => {
    cy.get('h1').contains('Loftbrú')
  })
})
