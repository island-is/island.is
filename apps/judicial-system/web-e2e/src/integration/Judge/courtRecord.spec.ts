describe('/domur/thingbok/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/thingbok/test_id_stadfest')
  })

  it('should require a valid court start time', () => {
    cy.getByTestid('courtStartDate').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtStartDate').type('122')
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtStartDate').clear().type('1222')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should autofill court attendees', () => {
    cy.getByTestid('courtAttendees').contains(
      'Áki Ákærandi aðstoðarsaksóknari Batman Robinsson kærða',
    )
  })

  it('should autofill police demands', () => {
    cy.getByTestid('policeDemands').contains(
      'Þess er krafist að Batman Robinsson, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should require a valid litigation presentation', () => {
    cy.getByTestid('litigationPresentations').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtStartDate').type('1222')
    cy.getByTestid('accusedPleaAnnouncement').type('lorem')
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdur/test_id_stadfest')
  })
})
