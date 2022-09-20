import { CREATE_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'

describe(CREATE_INDICTMENT_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(CREATE_INDICTMENT_ROUTE)
  })

  it('should validate the form', () => {
    // Police case number
    cy.get('#policeCaseNumbers').type('0').type('{enter}')
    cy.getByTestid('noPoliceCaseNumbersAssignedMessage').should('exist')
    cy.getByTestid('policeCaseNumbers-list').should('not.exist')
    cy.get('#policeCaseNumbers').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('#policeCaseNumbers').type('007202201').type('{enter}')
    cy.getByTestid('noPoliceCaseNumbersAssignedMessage').should('not.exist')
    cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 1)
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // National id
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    cy.getByTestid('nationalId').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('nationalId').clear().type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Case type
    cy.getByTestid('select-case-type').click()
    cy.get('[id="react-select-case-type-option-1"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })
})
