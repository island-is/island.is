import faker from 'faker'

import { Case, CaseState, Defendant } from '@island.is/judicial-system/types'
import { STEP_FIVE_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeRestrictionCase,
  makeCourt,
  makeProsecutor,
  intercept,
  Operation,
  hasOperationName,
} from '../../../utils'

describe(`${STEP_FIVE_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(`${STEP_FIVE_ROUTE}/test_id`)
  })

  it('should upload files to s3', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
    }

    intercept(caseDataAddition)

    cy.get('[name=fileUpload]').attachFile('lorem-ipsum.txt')
  })
})
