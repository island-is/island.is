describe('/domur/urskurdarord/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/urskurdarord/test_id_stadfest')
  })

  it('should display the case conclusion', () => {
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærða, Batman Robinsson, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
    )
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/stadfesta/test_id_stadfest')
  })
})
