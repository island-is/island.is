import {
  RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  CASES_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_COURT_OVERVIEW_ROUTE, () => {
  let caseId = ''

  before(() => {
    cy.intercept('GET', '**/api/lawyers/getLawyers', (req) => {
      req.reply({ fixture: 'lawyersResponse' })
    }).as('laywers')

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
            `http://localhost:4200${RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${caseId}`,
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
    cy.getByTestid('continueButton').should('be.enabled').click()
    cy.url().should(
      'contain',
      RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
    )
  })
})
