describe('gjafakort-web', () => {
  it('should redirect to /ferdagjof', () => {
    cy.visit('/')
    cy.url().should('be.equal', 'https://island.is/ferdagjof')
  })
})
