import faker from 'faker'

import { Case, UserRole } from '@island.is/judicial-system/types'
import { IC_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import { makeInvestigationCase, intercept } from '../../../utils'

describe(`${IC_CONFIRMATION_ROUTE}/:id`, () => {
  const ruling = faker.lorem.sentence()
  const conclusion = faker.lorem.sentence()

  it('should display the ruling', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      conclusion,
      ruling,
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${IC_CONFIRMATION_ROUTE}/test_id_stadfesting`)

    cy.contains(ruling)
  })
})
