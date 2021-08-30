describe('/krafa/domkrofur-og-lagaakvaedi/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/domkrofur-og-lagaakvaedi/test_id')
  })

  it('should require a valid requested custody end time', () => {
    cy.getByTestid('datepicker').click()
    cy.getByTestid('datepickerIncreaseMonth').click()
    cy.contains('15').click()
    cy.getByTestid('reqValidToDate-time').type('13:').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
    cy.getByTestid('reqValidToDate-time').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('reqValidToDate-time').clear().type('1333')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid laws broken value', () => {
    cy.getByTestid('lawsBroken').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('lawsBroken').type('Lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require at lease one custody provision to be selected', () => {
    cy.getByTestid('datepicker').click()
    cy.getByTestid('datepickerIncreaseMonth').click()
    cy.contains('15').click()
    cy.getByTestid('reqValidToDate-time').clear().type('1333')
    cy.getByTestid('lawsBroken').type('Lorem ipsum')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('checkbox').first().click()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('datepicker').click()
    cy.getByTestid('datepickerIncreaseMonth').click()
    cy.contains('15').click()
    cy.getByTestid('reqValidToDate-time').clear().type('1333')
    cy.getByTestid('lawsBroken').type('Lorem ipsum')
    cy.getByTestid('checkbox').first().click()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/krafa/greinargerd/test_id')
  })
})
