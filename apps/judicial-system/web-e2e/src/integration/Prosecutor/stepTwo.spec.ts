describe('/krafa/fyrirtaka/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/fyrirtaka/test_id')
  })

  it('should require a valid arrest time', () => {
    cy.getByTestid('datepicker').first().click()
    cy.contains('15').click()
    cy.getByTestid('arrestTime').type('13:').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
    cy.getByTestid('arrestTime').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('arrestTime').clear().type('1333')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid requested court date time', () => {
    cy.getByTestid('datepicker').last().click().clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('datepicker').last().click()
    cy.getByTestid('datepickerIncreaseMonth').dblclick()
    cy.contains('15').click()
    cy.getByTestid('requestedCourtDate').type('13:').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
    cy.getByTestid('requestedCourtDate').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('requestedCourtDate').clear().type('1333')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should set the default prosecutor as the user who created the case', () => {
    cy.getByTestid('select-prosecutor').contains('Áki Ákærandi')
  })

  it('should set the default court as Héraðsdómur Reykjavíkur when a case is created', () => {
    cy.getByTestid('select-court').contains('Héraðsdómur Reykjavíkur')
  })

  it.only('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('datepicker').first().click()
    cy.contains('15').click()
    cy.getByTestid('arrestTime').clear().type('1333')
    cy.getByTestid('datepicker').last().click()
    cy.getByTestid('datepickerIncreaseMonth').dblclick()
    cy.contains('15').click()
    cy.getByTestid('requestedCourtDate').clear().type('1333')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', '/krafa/domkrofur-og-lagaakvaedi/test_id')
  })
})
