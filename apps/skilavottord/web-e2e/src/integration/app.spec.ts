describe('skilavottord-web', () => {
  it('should show gdpr accept', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('app/skilavottord/my-cars')

    cy.get('input').click()

    cy.contains('Halda áfram').click()
  })
})
