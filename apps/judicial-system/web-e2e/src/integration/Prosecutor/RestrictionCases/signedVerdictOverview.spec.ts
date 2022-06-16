import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'
import { Case, CaseState } from '@island.is/judicial-system/types'

import { intercept, makeRestrictionCase, makeProsecutor } from '../../../utils'

describe('Signed verdict overview - Prosecutor - Restriction cases', () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      state: CaseState.ACCEPTED,
      validToDate: '2022-06-16T19:51:39.466Z',
    }

    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('caseDates').should('exist')
    cy.get('[data-testid="modfyRulingButton"]').should('not.exist')
  })
})
