import faker from 'faker'

import { Case, CaseType, UserRole } from '@island.is/judicial-system/types'
import { INVESTIGATION_CASE_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import { mockCase, intercept } from '../../../utils'

describe(`${INVESTIGATION_CASE_CONFIRMATION_ROUTE}/:id`, () => {
  const ruling = faker.lorem.sentence()
  const conclusion = faker.lorem.sentence()

  it('should display the ruling', () => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      conclusion,
      ruling,
    }

    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INVESTIGATION_CASE_CONFIRMATION_ROUTE}/test_id_stadfesting`)

    cy.contains(ruling)
  })
})
