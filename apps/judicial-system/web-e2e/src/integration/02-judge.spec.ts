describe('01. Custody request - Prosecutor', () => {
  beforeEach(() => cy.visit('/'))

  it('should run without failing', () => {
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

    // Step two
    cy.get('[data-testid=datepicker]').first().click()
    cy.get('[data-testid=datepickerIncreaseMonth]').click()
    cy.contains('15').click()
    cy.get('[data-testid=arrestTime]').type('13:37')

    cy.get('[data-testid=datepicker]').last().click()
    cy.get('[data-testid=datepickerIncreaseMonth]').click()
    cy.contains('16').click()
    cy.get('[data-testid=requestedCourtDate]').type('12:34')
    cy.get('[data-testid=continueButton]').click()
    cy.get('[data-testid=modalSecondaryButton]').click()

    // Step three
    cy.get('[data-testid=datepicker]').click()
    cy.get('[data-testid=datepickerIncreaseMonth]').click()
    cy.contains('17').click()
    cy.get('[data-testid=requestedCustodyEndTime]').type('12:34')
    cy.get('[data-testid=lawsBroken]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    )
    cy.contains('d-lið 1. mgr. 95. gr.').click()
    cy.get('[data-testid=continueButton]').click()

    // Step four
    cy.get('[data-testid=caseFacts]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    )
    cy.get('[data-testid=legalArguments]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    )
    cy.get('[data-testid=continueButton]').click()

    // Overview
    cy.get('[data-testid=continueButton]').click()
    cy.get('[data-testid=modalSecondaryButton]').click()
  })
})
