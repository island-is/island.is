import {
  CREATE_INDICTMENT_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition } from '@island.is/judicial-system/types'

import { transitionCase } from '../../../utils'

describe('Create indictment', () => {
  let caseId = ''

  before(() => {
    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
    cy.intercept(
      'GET',
      '**/api/nationalRegistry/getPersonByNationalId**',
      (req) => {
        req.reply({ fixture: 'nationalRegistryPersonResponse' })
      },
    ).as('getPersonByNationalId')
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should be able to create a case', () => {
    cy.getByTestid('createCaseDropdown').click()
    cy.get(`a[href="${CREATE_INDICTMENT_ROUTE}"]`).click()
    cy.url().should('contain', CREATE_INDICTMENT_ROUTE)

    cy.get('#policeCaseNumbers').type('0').type('{enter}')
    cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 0)
    cy.get('#policeCaseNumbers').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('#policeCaseNumbers').type('007202201').type('{enter}')
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

    cy.getByTestid('continueButton').click()
    cy.url().should('contain', INDICTMENTS_PROCESSING_ROUTE)

    cy.window().then((win) => {
      caseId = win.location.pathname.split('/')[4]
    })
  })
})
