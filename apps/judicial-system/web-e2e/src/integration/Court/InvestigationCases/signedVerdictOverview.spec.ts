import faker from 'faker'
import {
  INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { Case, CaseState, UserRole } from '@island.is/judicial-system/types'

import {
  intercept,
  makeCourt,
  makeInvestigationCase,
  makeCaseFile,
} from '../../../utils'

describe('Signed verdict overview - Court - Investigation case', () => {
  const conclusion = faker.lorem.paragraph(1)
  const caseFile = makeCaseFile('caseId', 'caseFileName')

  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.ACCEPTED,
      court: makeCourt(),
      conclusion,
      caseFiles: [caseFile],
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
})
