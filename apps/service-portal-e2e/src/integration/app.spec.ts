describe('service-portal', () => {
  it('should navigate the homepage', () => {
    cy.visit('/minarsidur')

    cy.contains('Yfirlit').click()
  })
})
