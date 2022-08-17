import { Case } from '@island.is/judicial-system/types'
import { STEP_FIVE_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeRestrictionCase,
  makeCourt,
  makeProsecutor,
  intercept,
  makeCaseFile,
} from '../../../utils'

describe(`${STEP_FIVE_ROUTE}/:id`, () => {
  beforeEach(() => {
    const file1 = makeCaseFile('file1', 'file1')
    const file2 = makeCaseFile('file2', 'file2')
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
      parentCase: { ...makeRestrictionCase(), caseFiles: [file1, file2] },
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${STEP_FIVE_ROUTE}/test_id`)
  })

  it('should upload files to s3', () => {
    cy.get('[name=fileUpload]').attachFile('lorem-ipsum.txt')
  })

  it('should list of files for parent case', () => {
    cy.get('button[aria-controls="parentCaseFiles"]').click()
    cy.get('#parentCaseFiles').children().should('have.length', 2)
  })
})
