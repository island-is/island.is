describe('/krafa/greinagerd/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/greinargerd/test_id')
  })

  it('should require a valid case facts value', () => {
    cy.get('[name=caseFacts]').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid legal arguments value', () => {
    cy.get('[name=legalArguments]').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/krafa/rannsoknargogn/test_id')
  })
})
