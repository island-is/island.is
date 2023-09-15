import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

import { intercept, makeProsecutor, mockCase } from '../../../utils'

describe('Signed verdict overview - Prosecutor - Investigation cases', () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      state: CaseState.ACCEPTED,
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('caseDates').should('not.exist')
    cy.get('[data-testid="modifyRulingButton"]').should('not.exist')
  })
})
