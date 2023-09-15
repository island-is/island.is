import faker from 'faker'
import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { intercept, makeCourt, makeCaseFile, mockCase } from '../../../utils'

describe('Signed verdict overview - Prison system staff - Restriction case', () => {
  const conclusion = faker.lorem.paragraph(1)
  const caseFile = makeCaseFile()

  beforeEach(() => {
    const caseData = mockCase(CaseType.CUSTODY)
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.ACCEPTED,
      court: makeCourt(),
      decision: CaseDecision.ACCEPTING,
      conclusion,
      caseFiles: [caseFile],
    }

    cy.login(UserRole.PRISON_SYSTEM_STAFF)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('courtRecordPDFButton')
    cy.getByTestid('custodyNoticePDFButton')
    cy.getByTestid('accordionItems').should('not.exist')
    cy.getByTestid('requestPDFButton').should('not.exist')
    cy.getByTestid('rulingPDFButton').should('not.exist')
  })
})
