import faker from 'faker'
import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseDecision,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  intercept,
  makeCourt,
  makeRestrictionCase,
  makeCaseFile,
} from '../../../utils'

describe('Signed verdict overview - Staff - Restriction case', () => {
  const conclusion = faker.lorem.paragraph(1)
  const caseFile = makeCaseFile('caseId', 'caseFileName')

  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.ACCEPTED,
      court: makeCourt(),
      decision: CaseDecision.ACCEPTING,
      conclusion,
      caseFiles: [caseFile],
    }

    cy.login(UserRole.STAFF)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('courtRecordPDFButton')
    cy.getByTestid('custodyNoticePDFButton')
    cy.getByTestid('accordionItems').should('not.exist')
    cy.getByTestid('requestPDFButton').should('not.exist')
    cy.getByTestid('rulingPDFButton').should('not.exist')
  })
})
