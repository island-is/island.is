import faker from 'faker'

import {
  CASES_ROUTE,
  RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseTransition,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase, deleteCase } from '../../../utils'
import { curry } from 'cypress/types/lodash'

describe(RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.OPEN)
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.SUBMIT)
      })
      .then(() => {
        cy.visit(
          'http://localhost:4200/api/auth/login?nationalId=0000002229',
        ).then(() =>
          cy.visit(
            `http://localhost:4200${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${caseId}`,
          ),
        )
      })
  })

  // after(() => {
  //   cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
  //     .then(() => cy.visit(`http://localhost:4200${CASES_ROUTE}`))
  //     .then(() => transitionCase(caseId, CaseTransition.DELETE))
  // })

  it('should validate the form', () => {
    cy.getByTestid('courtCaseNumber').type('R-123/2020')
    cy.getByTestid('continueButton').should('be.disabled')

    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()

    cy.getByTestid('continueButton').should('be.enabled').click()
    cy.url().should('contain', RESTRICTION_CASE_COURT_OVERVIEW_ROUTE)
  })
})
