import { Case } from '@island.is/judicial-system/types'
import { IC_CASE_FILES_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeRestrictionCase,
  makeCourt,
  intercept,
  makeCaseFile,
} from '../../../utils'

describe(`${IC_CASE_FILES_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(`${IC_CASE_FILES_ROUTE}/test_id`)
  })

  it('should upload files to s3', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
    }

    intercept(caseDataAddition)

    cy.get('[name=fileUpload]').attachFile('lorem-ipsum.txt')
  })

  it.only('should list of files for parent case', () => {
    const file1 = makeCaseFile('file1', 'file1')
    const file2 = makeCaseFile('file2', 'file2')
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      parentCase: { ...makeRestrictionCase(), caseFiles: [file1, file2] },
    }

    intercept(caseDataAddition)

    cy.get('button[aria-controls="parentCaseFiles"]').click()
    cy.get('#parentCaseFiles').children().should('have.length', 2)
  })
})
