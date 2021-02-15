describe('judicial-system-web', () => {
  beforeEach(() => cy.visit('/'))

  it('should display login message', () => {
    cy.visit('/api/auth/login?nationalId=0000000000')

    // Detention requests screen
    cy.contains('Stofna nýja kröfu').click()
    cy.contains('Gæsluvarðhald').click()

    // Step one
    cy.get('[data-testid=policeCaseNumber]').type('007202022')
    cy.contains('Karl').click()
    cy.get('[data-testid=nationalId]').type('0000000000')
    cy.get('[data-testid=accusedName]').type('Batman Robinsson')
    cy.get('[data-testid=accusedAddress]').type('Batcave 1337')
    cy.get('[data-testid=defenderName]').type('Alfred')
    // TODO: change
    cy.get('[data-testid=defenderEmail]').type('ivaro@kolibri.is')
    cy.get('[data-testid=continueButton]').click()
  })
})
