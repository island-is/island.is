describe('icelandic-names-registry-web', () => {
  it('should navigate the admin', () => {
    cy.visit('/minarsidur')
    cy.contains('Eldri útgáfa').click()
  })
})
