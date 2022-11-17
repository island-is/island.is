import {
  RESTRICTION_CASE_COURT_RECORD_ROUTE,
  CASES_ROUTE,
  RESTRICTION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'
import faker from 'faker'

import { transitionCase, loginAndCreateCase, updateCase } from '../../../utils'

describe(RESTRICTION_CASE_RULING_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        updateCase(caseId, {
          introduction: faker.lorem.sentence(),
          demands: faker.lorem.sentence(),
          caseFacts: faker.lorem.sentence(),
          legalArguments: faker.lorem.sentence(),
          conclusion: faker.lorem.sentence(),
        })
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.OPEN)
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.SUBMIT)
      })
      .then(() => {
        cy.visit(
          'http://localhost:4200/api/auth/login?nationalId=0000002229',
        ).then(() =>
          cy.visit(
            `http://localhost:4200${RESTRICTION_CASE_RULING_ROUTE}/${caseId}`,
          ),
        )
      })
  })

  after(() => {
    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
      .then(() => cy.visit(`http://localhost:4200${CASES_ROUTE}`))
      .then(() => transitionCase(caseId, CaseTransition.DELETE))
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should(
      'include',
      `${RESTRICTION_CASE_COURT_RECORD_ROUTE}/${caseId}`,
    )
  })
})
