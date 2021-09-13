describe('/domur/thingbok/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/thingbok/test_id_stadfest')
  })

  it('should autofill court attendees', () => {
    cy.getByTestid('courtAttendees').contains(
      'Áki Ákærandi aðstoðarsaksóknari Batman Robinsson kærða',
    )
  })

  it('should autofill prosecutor demands', () => {
    cy.getByTestid('prosecutorDemands').contains(
      'Þess er krafist að Batman Robinsson, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtStartDate-time').type('1222')
    cy.get('#accused-plea-decision-rejecting').check()
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdur/test_id_stadfest')
  })
})
