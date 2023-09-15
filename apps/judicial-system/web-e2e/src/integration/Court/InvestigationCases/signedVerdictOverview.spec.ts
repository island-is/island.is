import faker from 'faker'
import {
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  intercept,
  makeCourt,
  mockCase,
  makeCaseFile,
  makeJudge,
} from '../../../utils'

describe('Signed verdict overview - Court - Investigation case', () => {
  const conclusion = faker.lorem.paragraph(1)
  const caseFile = {
    ...makeCaseFile({
      caseId: 'caseId',
      name: 'caseFileName',
    }),
    category: undefined,
  }

  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.ACCEPTED,
      court: makeCourt(),
      conclusion,
      caseFiles: [caseFile],
      judge: makeJudge(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on the page', () => {
    cy.get('[aria-controls="caseFilesAccordionItem"]').click()
    cy.get('#caseFilesAccordionItem').within(() => {
      cy.get(`[aria-label="Opna ${caseFile.name}"]`)
    })
    cy.contains('Úrskurðarorð')
    cy.contains(conclusion)
  })

  it('should be able to sign the court record', () => {
    cy.get('[data-testid="signCourtRecordButton"]').should('exist')
  })
})
