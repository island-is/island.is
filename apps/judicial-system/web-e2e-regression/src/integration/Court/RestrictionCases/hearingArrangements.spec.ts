import {
  RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  CASES_ROUTE,
  RESTRICTION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase, updateCase } from '../../../utils'

describe(RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        updateCase(caseId, { requestedCourtDate: '2020-09-16T19:50:08.033Z' })
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
            `http://localhost:4200${RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`,
          ),
        )
      })
  })

  after(() => {
    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
      .then(() => cy.visit(`http://localhost:4200${CASES_ROUTE}`))
      .then(() => transitionCase(caseId, CaseTransition.DELETE))
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', `${RESTRICTION_CASE_RULING_ROUTE}/${caseId}`)
  })
})
