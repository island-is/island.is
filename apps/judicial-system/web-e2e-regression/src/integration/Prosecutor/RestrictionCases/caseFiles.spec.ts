import {
  RESTRICTION_CASE_OVERVIEW_ROUTE,
  RESTRICTION_CASE_CASE_FILES_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_CASE_FILES_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(
        `http://localhost:4200/${RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`,
      )
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').should('be.enabled').click()
    cy.url().should('contain', RESTRICTION_CASE_OVERVIEW_ROUTE)
  })
})
