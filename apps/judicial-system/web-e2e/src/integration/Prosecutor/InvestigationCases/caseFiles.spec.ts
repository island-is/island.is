import { Case } from '@island.is/judicial-system/types'
import { IC_CASE_FILES_ROUTE } from '@island.is/judicial-system/consts'

import { makeRestrictionCase, makeCourt, intercept } from '../../../utils'

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
})
