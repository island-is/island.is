import {
  INDICTMENTS_CASE_FILES_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseType, UserRole } from '@island.is/judicial-system/types'

import { makeCourt, mockCase, makeProsecutor, intercept } from '../../../utils'

describe(`${INDICTMENTS_PROCESSING_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INDICTMENT)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_PROCESSING_ROUTE}/test_id`)
  })

  it('should navigate to the correct page on continue', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should('contain', INDICTMENTS_CASE_FILES_ROUTE)
  })
})
