import faker from 'faker'

import { Case, UserRole } from '@island.is/judicial-system/types'
import { IC_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import { makeInvestigationCase, intercept } from '../../../utils'

describe(`${IC_CONFIRMATION_ROUTE}/:id`, () => {
  const ruling = faker.lorem.sentence()

  beforeEach(() => {
    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${IC_CONFIRMATION_ROUTE}/test_id_stadfesting`)
  })

  it('should display the ruling', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      conclusion:
        'Kærða, Donald Duck kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
      ruling,
    }

    intercept(caseDataAddition)

    cy.contains(ruling)
  })
})
