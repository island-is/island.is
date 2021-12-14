/// <reference path="../../support/index.d.ts" />

describe('applicant flow', () => {
  it('should login', () => {
    cy.visit('/')
    cy.contains('Samband Íslenskra Sveitarfélaga - Fjárhagsaðstoð')
    cy.get('input').first().focus().type('0107789')
    cy.wait(1000)
    cy.contains('Auðkenna').click()
  })

  it('should be logged in', () => {
    cy.url().should('include', '/umsokn')
  })

  it('should get error if data gathering is not accepted', () => {
    cy.getByTestId('continueButton').click()
    cy.contains('Þú þarft að samþykkja gagnaöflun')
  })
})
