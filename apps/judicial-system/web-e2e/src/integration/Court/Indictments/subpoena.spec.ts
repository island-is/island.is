import {
  CaseState,
  CaseType,
  IndictmentSubtype,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  INDICTMENTS_DEFENDER_ROUTE,
  INDICTMENTS_SUBPOENA_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeCourt, intercept, mockCase } from '../../../utils'

describe(`${INDICTMENTS_SUBPOENA_ROUTE}/:id`, () => {
  const caseData = mockCase(
    CaseType.INDICTMENT,
    IndictmentSubtype.MAJOR_ASSAULT,
  )

  beforeEach(() => {
    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      court: makeCourt(),
      courtDate: '2020-09-16T19:50:08.033Z',
    }

    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_SUBPOENA_ROUTE}/${caseData.id}`)
  })

  it('should enable continue button when required fields are valid', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalPrimaryButton').click()
    cy.url().should('include', `${INDICTMENTS_DEFENDER_ROUTE}/${caseData.id}`)
  })
})
