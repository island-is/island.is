/// <reference path="../../support/index.d.ts" />

describe('/krofur', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krofur')
  })

  it('should have a table with one row that is a button', () => {
    cy.getByTestid('custody-petitions-table-row').should(
      'have.attr',
      'role',
      'button',
    )
  })

  it('should have a button that allows me to create a custody and travel ban requests', () => {
    cy.contains('Stofna nýja kröfu').click()
    cy.contains('a', 'Gæsluvarðhald')
    cy.contains('a', 'Farbann')
  })

  it('should have a button that allows me to delete cases', () => {
    cy.getByTestid('deleteCase').click()
    cy.contains('button', 'Afturkalla')
  })
})
