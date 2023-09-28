import faker from 'faker'

import {
  RESTRICTION_CASE_COURT_RECORD_ROUTE,
  CASES_ROUTE,
  RESTRICTION_CASE_CONFIRMATION_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseDecision,
  CaseTransition,
  CaseType,
} from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase, updateCase } from '../../../utils'

describe(RESTRICTION_CASE_COURT_RECORD_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.OPEN)
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.SUBMIT)
      })
      .then(() => {
        cy.visit('http://localhost:4200/api/auth/login?nationalId=0000002229')
      })
      .then(() => {
        updateCase(caseId, {
          courtDate: '2021-04-29T12:45:00.000Z',
          courtLocation: faker.lorem.word(),
          conclusion: faker.lorem.sentence(),
          ruling: faker.lorem.sentence(),
          decision: CaseDecision.ACCEPTING,
        })
      })
      .then(() =>
        cy.visit(
          `http://localhost:4200${RESTRICTION_CASE_COURT_RECORD_ROUTE}/${caseId}`,
        ),
      )
  })

  after(() => {
    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
      .then(() => cy.visit(`http://localhost:4200${CASES_ROUTE}`))
      .then(() => transitionCase(caseId, CaseTransition.DELETE))
  })

  it('should validate the form', () => {
    cy.get('#accused-accept').check()
    cy.get('#prosecutor-appeal').check()

    cy.get('#courtEndTime').type('2020-10-10')
    cy.get('#courtEndTime').type('{enter}')
    cy.get('#courtEndTime-time').type('10:10')

    cy.getByTestid('continueButton').click()
    cy.url().should(
      'include',
      `${RESTRICTION_CASE_CONFIRMATION_ROUTE}/${caseId}`,
    )
  })
})
