import faker from 'faker'
import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'
import { Case, CaseState, UserRole } from '@island.is/judicial-system/types'

import {
  intercept,
  makeCourt,
  makeInvestigationCase,
  makeCaseFile,
} from '../../../utils'

describe('Signed verdict overview - Staff - Investigation case', () => {
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

    cy.login(UserRole.STAFF)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('courtRecordPDFButton')
    cy.getByTestid('accordionItems').should('not.exist')
    cy.getByTestid('requestPDFButton').should('not.exist')
    cy.getByTestid('rulingPDFButton').should('not.exist')
  })
})
