import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'
import { Case } from '@island.is/judicial-system/types'

import { intercept, makeRestrictionCase, makeProsecutor } from '../../../utils'

describe('Signed verdict overview - prosecutor - restricton cases', () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should not have a button for modifying the ruling', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('not.exist')
  })
})
