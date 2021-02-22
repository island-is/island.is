describe('/domur/urskurdur/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/urskurdur/test_id_stadfest')
  })

  it('should require a valid ruling', () => {
    cy.getByTestid('ruling').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should not display the custody/travel ban end date if a decision has not been made', () => {
    // TODO: Find a way to test that this section appears when a decision is made.
    cy.wait('@gqlUpdateCaseMutatation')
    cy.getByTestid('caseDecisionSection').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdarord/test_id_stadfest')
  })
})
