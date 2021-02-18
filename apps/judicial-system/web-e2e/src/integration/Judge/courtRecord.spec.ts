describe('/domur/krafa/fyrirtokutimi/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/thingbok/test_id_stadfest')
  })

  it.only('should require a valid court start time', () => {
    cy.getByTestid('courtStartTime').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtStartTime').type('122')
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtStartTime').clear().type('1222')
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

  it('should require a valid accused plea announcement', () => {
    cy.getByTestid('accusedPleaAnnouncement').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedPleaAnnouncement').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid accused plea announcement', () => {
    cy.getByTestid('litigationPresentations').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtStartTime').type('1222')
    cy.getByTestid('accusedPleaAnnouncement').type('lorem')
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdur/test_id_stadfest')
  })
})
