import { Case, CaseType, UserRole } from '@island.is/judicial-system/types'
import { RESTRICTION_CASE_CASE_FILES_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeCourt,
  makeProsecutor,
  intercept,
  makeCaseFile,
  mockCase,
} from '../../../utils'

describe(`${RESTRICTION_CASE_CASE_FILES_ROUTE}/:id`, () => {
  beforeEach(() => {
    const file1 = makeCaseFile({ name: 'file1' })
    const file2 = makeCaseFile({ name: 'file2' })
    const caseData = mockCase(CaseType.CUSTODY)
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
      parentCase: { ...mockCase(CaseType.CUSTODY), caseFiles: [file1, file2] },
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${RESTRICTION_CASE_CASE_FILES_ROUTE}/test_id`)
  })

  it('should upload files to s3', () => {
    cy.get('[name=fileUpload]').attachFile('lorem-ipsum.txt')
  })

  it('should list of files for parent case', () => {
    cy.get('button[aria-controls="parentCaseFiles"]').click()
    cy.get('#parentCaseFiles').children().should('have.length', 2)
  })
})
