describe('applicant flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should login', () => {
    cy.contains('Samband Íslenskra Sveitarfélaga - Fjárhagsaðstoð')
    cy.get('phoneUserIdentifier').focus().type('0107789')
    cy.get('submitPhoneNumber').click()
  })

  it('should be logged in', () => {
    cy.url().should('include', '/umsokn')
  })

  it('should get error if data gathering is not accepted', () => {
    cy.getByTestId('continueButton').click()
    cy.contains('Þú þarft að samþykkja gagnaöflun')
  })
})
