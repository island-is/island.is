import faker from 'faker'

import { Case, UserRole } from '@island.is/judicial-system/types'
import { IC_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import { makeInvestigationCase, intercept } from '../../../utils'

describe(`${IC_CONFIRMATION_ROUTE}/:id`, () => {
  const ruling = faker.lorem.sentence()
  const conclusion = faker.lorem.sentence()

  beforeEach(() => {
    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${IC_CONFIRMATION_ROUTE}/test_id_stadfesting`)
  })

  it('should display the ruling', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      conclusion,
      ruling,
    }

    intercept(caseDataAddition)

    cy.contains(ruling)
  })
})
