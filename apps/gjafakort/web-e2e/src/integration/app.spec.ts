describe('gjafakort-web', () => {
  it('should display welcome message', () => {
    cy.visit('/')
    cy.get('h1').contains('Gjöf til ferðalaga innanlands')
  })
})
