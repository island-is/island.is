import {
  MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW,
} from '@island.is/judicial-system/consts'
import { Case, UserRole } from '@island.is/judicial-system/types'

import { intercept, makeCourt, makeRestrictionCase } from '../../../utils'

describe('Signed verdict overview - Court - Restriction cases', () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should have a button for modifying the ruling that navigates to a modify ruling page', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('exist').click()
    cy.url().should('include', MODIFY_RULING_ROUTE)
  })
})
