import {
  IC_MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW,
} from '@island.is/judicial-system/consts'
import { Case, UserRole } from '@island.is/judicial-system/types'

import { intercept, makeCourt, makeInvestigationCase } from '../../../utils'

describe('Signed verdict overview - Court - Investigation case', () => {
  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  // TODO: The button is currently under feature flag. Remove .skip() when feature flag is removed.
  it.skip('should have a button for modifying the ruling that navigates to a modify ruling page', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('exist').click()
    cy.url().should('include', IC_MODIFY_RULING_ROUTE)
  })
})
