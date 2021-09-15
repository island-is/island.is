describe('/domur/krafa/fyrirtokutimi/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', '/domur/thingbok/test_id_stadfest')
  })
})
