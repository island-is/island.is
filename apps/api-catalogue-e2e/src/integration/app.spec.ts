describe('api-catalog', () => {
  beforeEach(() => cy.visit('/'))

  it('should display homepage', () => {
    cy.visit('/')
    cy.contains('title')
  })
})
