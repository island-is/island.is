describe('Custody request - Judge', () => {
  beforeEach(() => cy.visit('/'))

  xit('should run without failing', () => {
    cy.visit('/api/auth/login?nationalId=2222222222')
    cy.get('[data-testid=detention-requests-table-row]')
      .first()
      .click({ timeout: 20000 })

    // Overview
    cy.get('[data-testid=courtCaseNumber]').clear().type('R-X/1980')
    cy.get('[data-testid=continueButton]').click()

    // Hearing arrangements
    cy.get('[data-testid=select-judge]').click()
    cy.get('#react-select-judge-option-0').click()
    cy.get('[data-testid=select-registrar]').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.get('[data-testid=courtroom]').type('123')
    cy.get('[data-testid=continueButton]').click()

    // Court record
    cy.get('[data-testid=courtStartTime]').type('12:24')
    cy.get('[data-testid=policeDemands]').type('Lorem ipsum dolor sit am')
    cy.get('#accused-plea-decision-accepting').click()
    cy.get('[data-testid=accusedPleaAnnouncement]').type(
      'Lorem ipsum dolor sit am',
    )
    cy.get('[data-testid=litigationPresentations]').type(
      'Lorem ipsum dolor sit am',
    )
    cy.get('[data-testid=continueButton]').click()

    // Ruling step one
    cy.contains('Krafa um gæsluvarðhald samþykkt').click()
    cy.get('[data-testid=ruling]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    )
    cy.get('[data-testid=continueButton]').click()

    // Ruling step two
    cy.contains('Kærði unir úrskurðinum').click()
    cy.contains('Sækjandi unir úrskurðinum').click()
    cy.get('[data-testid=continueButton]').click()

    // Confirmation
    cy.get('[data-testid=courtEndTime]').type('1337')
    cy.get('[data-testid=continueButton]').click()
    cy.get('[data-testid=modalSecondaryButton]').click()
  })
})
