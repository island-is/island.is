/// <reference path="../../support/index.d.ts" />
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

  it('should not display the custody/travel ban end date if a decision is rejected', () => {
    cy.wait('@gqlUpdateCaseMutatation')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdarord/test_id_stadfest')
  })
})
