import {
  RESTRICTION_CASE_OVERVIEW_ROUTE,
  CASES_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_OVERVIEW_ROUTE, () => {
  let caseId = ''

  beforeEach(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.OPEN)
      })
      .then(() => {
        cy.visit(
          `http://localhost:4200${RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}`,
        )
      })
  })

  afterEach(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').should('be.enabled').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', CASES_ROUTE)
  })

  it('should submit the case on continue', () => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (
        req.body.operationName === 'TransitionCase' &&
        req.body.variables.input.transition !== CaseTransition.DELETE
      ) {
        expect(req.body.variables.input.id).to.equal(caseId)
        expect(req.body.variables.input.transition).to.equal(
          CaseTransition.SUBMIT,
        )
      }
    })

    cy.getByTestid('continueButton').should('be.enabled').click()
  })
})
