import { CREATE_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'

describe(CREATE_INDICTMENT_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(CREATE_INDICTMENT_ROUTE)
  })

  it('should validate the form', () => {
    // Police case number
    cy.getByTestid('policeCaseNumber0').type('0')
    cy.getByTestid('policeCaseNumber0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 012-3456-7890')
    cy.getByTestid('policeCaseNumber0').clear()
    cy.getByTestid('policeCaseNumber0').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('policeCaseNumber0').type('007202201')
    cy.getByTestid('policeCaseNumber0').blur()
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // National id
    cy.getByTestid('nationalId').type('0')
    cy.getByTestid('nationalId').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    cy.getByTestid('nationalId').clear()
    cy.getByTestid('nationalId').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('nationalId').clear()
    cy.getByTestid('nationalId').type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Case type
    cy.getByTestid('select-case-type').click()
    cy.get('[id="react-select-case-type-option-1"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })
})
