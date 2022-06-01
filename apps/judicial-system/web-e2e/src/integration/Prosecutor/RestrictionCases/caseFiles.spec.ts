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
    // cy.stubAPIResponses()
    cy.visit(`${STEP_FIVE_ROUTE}/test_id`)
  })

  it.only('should have a info panel about how to resend a case if the case has been received', () => {
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
