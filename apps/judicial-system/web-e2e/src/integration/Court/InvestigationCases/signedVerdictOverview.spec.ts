import faker from 'faker'
import {
  INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
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
  const caseFile = makeCaseFile('caseId', 'caseFileName')

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

  it('should have a button for modifying the ruling that navigates to a modify ruling page', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('exist').click()
    cy.url().should('include', INVESTIGATION_CASE_MODIFY_RULING_ROUTE)
  })

  it('should be able to sign the court record', () => {
    cy.get('[data-testid="signCourtRecordButton"]').should('exist')
  })
})

describe('Signed verdict overview - Court - Not the assigned judge', () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      state: CaseState.ACCEPTED,
      isValidToDateInThePast: false,
      validToDate: '2022-06-13T19:51:39.466Z',
      isolationToDate: '2022-06-13T19:51:39.466Z',
      judge: { ...makeJudge(), id: 'some_other_judge_id' },
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should not have a button for modifying the ruling', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('not.exist')
  })
})
