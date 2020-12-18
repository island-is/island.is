describe('service-portal', () => {
  it('should navigate the homepage', () => {
    cy.visit('/')
    cy.contains('Næsta skref').click()
  })
})
