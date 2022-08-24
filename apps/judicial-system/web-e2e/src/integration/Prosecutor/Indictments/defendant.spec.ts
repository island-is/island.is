import {
  CREATE_INDICTMENT_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'

describe(CREATE_INDICTMENT_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(CREATE_INDICTMENT_ROUTE)
  })

  it('should validate the form', () => {
    // Police case number
    cy.getByTestid('policeCaseNumber').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 012-3456-7890')
    cy.getByTestid('policeCaseNumber').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('policeCaseNumber').clear().type('00000000000')
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

    // Birthday
    cy.get('[type="checkbox"]').check()
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 00.00.0000')
    cy.getByTestid('nationalId').clear().type('01.01.2000')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Address
    cy.getByTestid('accusedAddress').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedAddress').clear().type('Sidwellssongata 300')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Name
    cy.getByTestid('accusedName').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedName').clear().type('Sidwell Sidwellsson')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Case type
    cy.getByTestid('select-type').click()
    cy.get('[id="react-select-type-option-1"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })
})
