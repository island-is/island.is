describe('/domur/krafa/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/krafa/test_id_stadfest')
  })

  it('should have an overview of the current case', () => {
    cy.getByTestid('infoCard').contains(
      'Batman Robinsson, kt. 000000-0000, Batcave 1337',
    )
    cy.getByTestid('infoCardDataContainer0').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer1').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer2').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
  })

  it('should require a valid case id', () => {
    cy.getByTestid('courtCaseNumber').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should display the correct demands, laws broken, custody provisions, and custody restriction', () => {
    cy.contains(
      'Þess er krafist að Batman Robinsson, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
    cy.getByTestid('lawsBroken').contains('Lorem ipsum')
    cy.getByTestid('custodyProvisions').contains('a-lið 1. mgr. 95. gr.')
    cy.getByTestid('custodyRestrictions')
      .children()
      .should('contain', 'B - Einangrun')
      .should('contain', 'E - Fjölmiðlabann')
  })

  it('should have a button to a PDF of the case', () => {
    cy.contains('button', 'Opna PDF kröfu')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/fyrirtokutimi/test_id_stadfest')
  })
})
