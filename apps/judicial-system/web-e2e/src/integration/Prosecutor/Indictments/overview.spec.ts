import {
  CASES_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'

import { makeCourt, mockCase, makeProsecutor, intercept } from '../../../utils'

describe(`${INDICTMENTS_OVERVIEW_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.MURDER)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      court: makeCourt(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_OVERVIEW_ROUTE}/test_id`)
  })

  it('should navigate to the correct page on continue', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalPrimaryButton').click()
    cy.url().should('contain', CASES_ROUTE)
  })
})
