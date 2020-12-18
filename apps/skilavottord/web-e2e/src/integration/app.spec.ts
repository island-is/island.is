describe('skilavottord-web', () => {
  it('should show gdpr accept', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('skilavottord/my-cars')

    cy.get('input').click()

    cy.contains('Halda áfram').click()
  })
})
