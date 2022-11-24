import faker from 'faker'

import {
  CREATE_RESTRICTION_CASE_ROUTE,
  RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
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
    cy.get(`a[href="${CREATE_RESTRICTION_CASE_ROUTE}"]`).click()
    cy.url().should('contain', CREATE_RESTRICTION_CASE_ROUTE)

    cy.get('#policeCaseNumbers').type('0')
    cy.getByTestid('multipleValueListContainer').within(() =>
      cy.get('button').should('be.disabled'),
    )
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

    cy.getByTestid('leadInvestigator').type(faker.name.firstName())

    cy.getByTestid('continueButton').click()
    cy.url().should('contain', RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE)

    cy.window().then((win) => {
      caseId = win.location.pathname.split('/')[3]
    })
  })
})
