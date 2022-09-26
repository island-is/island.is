import { DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseFileCategory,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { intercept, makeCaseFile, mockCase } from '../../../utils'

describe('Indictment case overview for defenders', () => {
  const theCase = mockCase(CaseType.MURDER)

  describe('Closed cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.ACCEPTED,
        caseFiles: [
          makeCaseFile({ category: CaseFileCategory.COURT_RECORD }),
          makeCaseFile({ category: CaseFileCategory.RULING }),
          makeCaseFile({ category: CaseFileCategory.COST_BREAKDOWN }),
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_ROUTE}/akaera/test_id`)
    })

    it('should list all case files, including COURT_RECORD and RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 3)
    })
  })

  describe('Open cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.RECEIVED,
        caseFiles: [
          makeCaseFile({ category: CaseFileCategory.COURT_RECORD }),
          makeCaseFile({ category: CaseFileCategory.RULING }),
          makeCaseFile({ category: CaseFileCategory.COST_BREAKDOWN }),
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_ROUTE}/akaera/test_id`)
    })

    it('should not list casefiles with category COURT_RECORD or RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 1)
    })
  })
})
